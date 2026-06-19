// Family Moments AI — server-side AI (Supabase Edge Function, Deno).
//
// This is the ONLY place the Anthropic API key lives. The mobile app never sees
// it; the app calls this function with the user's Supabase session and the
// function calls Claude. Deploy with:
//
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy ai
//
// Actions:
//   assistant — Family Chat reply + the single best follow-up action
//   search    — interpret a natural-language memory query
//   caption   — vision: describe/tag one photo (used by the upload pipeline)
import Anthropic from 'npm:@anthropic-ai/sdk@0.69.0';

const MODEL = 'claude-opus-4-8';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '' });

/** Pull the first text block out of a Claude response. */
function firstText(msg: Anthropic.Message): string {
  for (const block of msg.content) if (block.type === 'text') return block.text;
  return '';
}

const APP_CONTEXT =
  'You are the in-app memory assistant for "Family Moments AI", an app that ' +
  'organizes a family\'s photos by child, detects milestones (first steps, first ' +
  'birthday, first day of school…), and turns moments into reels, memory books, ' +
  'and prints. The user is a parent. Be warm, concise (1–2 sentences), and never ' +
  'fabricate exact photo counts or dates as if you could see their library.';

async function assistant(text: string) {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: APP_CONTEXT,
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'The reply shown to the parent.' },
            action: {
              type: 'string',
              enum: ['book', 'reel', 'shop', 'search', 'none'],
              description: 'The single most relevant follow-up the app should offer.',
            },
          },
          required: ['text', 'action'],
          additionalProperties: false,
        },
      },
    },
    messages: [{ role: 'user', content: text }],
  });
  const out = JSON.parse(firstText(msg)) as { text: string; action: string };
  const actionKey = out.action === 'none' ? null : out.action;
  // Preview thumbnails (gradient indices) keyed off the chosen action.
  const idxByAction: Record<string, number[]> = {
    book: [0, 3, 8, 5], reel: [1, 6, 9], shop: [3, 0], search: [2, 10, 5, 8],
  };
  return { text: out.text, actionKey, photoIdx: actionKey ? idxByAction[actionKey] ?? [] : [] };
}

async function search(query: string) {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: APP_CONTEXT + ' Summarize what the user is looking for in one short line.',
    messages: [{ role: 'user', content: `Search query: "${query}". Give a one-line summary of what to surface.` }],
  });
  return { answer: query ? firstText(msg) : '', sub: 'Newest first' };
}

async function caption(mediaType: string, dataBase64: string) {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 200,
    system: 'Describe this family photo in one short caption and 3–6 lowercase tags ' +
      '(who/what/where). Do not guess names of specific people.',
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            caption: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['caption', 'tags'],
          additionalProperties: false,
        },
      },
    },
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: dataBase64 } },
        { type: 'text', text: 'Caption and tag this photo.' },
      ],
    }],
  });
  return JSON.parse(firstText(msg)) as { caption: string; tags: string[] };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!Deno.env.get('ANTHROPIC_API_KEY')) return json({ error: 'ANTHROPIC_API_KEY not set' }, 500);
  try {
    const body = await req.json();
    switch (body.action) {
      case 'assistant': return json(await assistant(String(body.text ?? '')));
      case 'search': return json(await search(String(body.query ?? '')));
      case 'caption': return json(await caption(String(body.mediaType ?? 'image/jpeg'), String(body.dataBase64 ?? '')));
      default: return json({ error: 'unknown action' }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'failed' }, 500);
  }
});
