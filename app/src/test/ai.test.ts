/* Phase 3 services: face-clustering grouping + generation/milestone shapes
 * (mock fallbacks, since no backend is configured in tests). */
import { describe, it, expect } from 'vitest';
import { assignChild, groupByChild, UNASSIGNED, type MediaItem } from '../services/clustering';
import { generateStory, generateReel, generateBook, detectMilestones } from '../services/ai';

const children = [{ id: 'roan', name: 'Roan' }, { id: 'mila', name: 'Mila' }];

describe('clustering', () => {
  it('assigns by explicit child_id, then by name tag, else unassigned', () => {
    expect(assignChild({ id: '1', childId: 'roan' }, children)).toBe('roan');
    expect(assignChild({ id: '2', childId: null, tags: ['beach', 'mila'] }, children)).toBe('mila');
    expect(assignChild({ id: '3', childId: null, tags: ['sunset'] }, children)).toBe(UNASSIGNED);
  });

  it('groups media into per-child buckets plus unassigned', () => {
    const items: MediaItem[] = [
      { id: 'a', childId: 'roan' },
      { id: 'b', childId: null, tags: ['Mila'] },
      { id: 'c', childId: null },
    ];
    const groups = groupByChild(items, children);
    expect(groups.roan.map((m) => m.id)).toEqual(['a']);
    expect(groups.mila.map((m) => m.id)).toEqual(['b']);
    expect(groups[UNASSIGNED].map((m) => m.id)).toEqual(['c']);
  });
});

describe('generation (offline fallbacks)', () => {
  it('generateStory returns a title and paragraphs', async () => {
    const s = await generateStory('First steps', 'Mila');
    expect(s.title).toBeTruthy();
    expect(s.paragraphs.length).toBeGreaterThan(0);
  });

  it('generateReel returns scenes and a duration', async () => {
    const r = await generateReel('April 2026');
    expect(r.scenes.length).toBeGreaterThan(0);
    expect(r.durationSec).toBeGreaterThan(0);
  });

  it('generateBook returns pages with headings', async () => {
    const b = await generateBook('Roan — Year One');
    expect(b.pages.length).toBeGreaterThan(0);
    expect(b.pages[0]).toHaveProperty('heading');
  });

  it('detectMilestones returns milestone records', async () => {
    const m = await detectMilestones([{ caption: 'baby standing up', date: '2026-03-03' }]);
    expect(Array.isArray(m)).toBe(true);
    expect(m[0]).toHaveProperty('title');
  });
});
