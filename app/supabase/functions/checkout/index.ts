// Family Moments AI — print-shop checkout (Supabase Edge Function, Deno).
//
// Physical print orders use Stripe (NOT in-app purchase) + a print-on-demand
// provider. The Stripe SECRET key and the provider key live ONLY here, as
// secrets — never in the app:
//
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   supabase secrets set PRINT_PROVIDER_KEY=...        # optional (Prodigi/Gelato/…)
//   supabase functions deploy checkout
//
// Actions:
//   intent — create a Stripe PaymentIntent for the cart (returns clientSecret)
//   order  — after payment succeeds, fulfil with the POD provider + record it
import Stripe from 'npm:stripe@17.5.0';
import { createClient } from 'npm:@supabase/supabase-js@2.108.2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2025-09-30.clover' });
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type Item = { id: string; name: string; price: number; qty: number };

/** Verify the caller is a member of the family they're ordering for. */
async function isMember(authHeader: string, familyId: string): Promise<boolean> {
  const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data } = await userClient
    .from('family_members').select('family_id').eq('family_id', familyId).limit(1).maybeSingle();
  return Boolean(data);
}

/** Submit the order to the print-on-demand provider (stub if unconfigured). */
async function fulfil(items: Item[], shipping: Record<string, unknown>): Promise<string> {
  const key = Deno.env.get('PRINT_PROVIDER_KEY');
  if (!key) return 'pod-stub-' + crypto.randomUUID().slice(0, 8);
  // TODO(phase4): map `items` to the provider's SKUs and POST to its orders API.
  // e.g. await fetch('https://api.prodigi.com/v4.0/Orders', { headers: { 'X-API-Key': key }, ... })
  void shipping;
  return 'pod-' + crypto.randomUUID().slice(0, 8);
}

const orderNo = () => 'FM-' + Math.floor(100000 + Math.random() * 899999);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!Deno.env.get('STRIPE_SECRET_KEY')) return json({ error: 'STRIPE_SECRET_KEY not set' }, 500);
  const auth = req.headers.get('Authorization') ?? '';
  try {
    const body = await req.json();

    if (body.action === 'intent') {
      const amount = Math.round(Number(body.amountCents));
      if (!Number.isFinite(amount) || amount <= 0) return json({ error: 'invalid amount' }, 400);
      // TODO(phase4): recompute `amount` from a server-side catalog, don't trust the client.
      const pi = await stripe.paymentIntents.create({
        amount, currency: String(body.currency ?? 'eur'),
        automatic_payment_methods: { enabled: true },
      });
      return json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
    }

    if (body.action === 'order') {
      const familyId = String(body.familyId ?? '');
      if (!(await isMember(auth, familyId))) return json({ error: 'not a family member' }, 403);
      const pi = await stripe.paymentIntents.retrieve(String(body.paymentIntentId));
      if (pi.status !== 'succeeded') return json({ error: 'payment not completed' }, 402);

      const providerRef = await fulfil(body.items ?? [], body.shipping ?? {});
      const no = orderNo();
      const admin = createClient(SUPABASE_URL, SERVICE_KEY);
      await admin.from('orders').insert({
        family_id: familyId, order_no: no, amount_cents: pi.amount, currency: pi.currency,
        status: 'paid', stripe_payment_intent: pi.id, provider_ref: providerRef,
      });
      return json({ orderNo: no, providerRef });
    }

    return json({ error: 'unknown action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'failed' }, 500);
  }
});
