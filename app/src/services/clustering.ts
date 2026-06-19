/* Per-child grouping / face clustering.
 *
 * Production pipeline (Phase 3, deeper work):
 *   1. Detect faces in each photo (on-device ML — e.g. a Capacitor MLKit /
 *      Vision plugin) and compute a face embedding per face.
 *   2. Cluster embeddings (e.g. agglomerative / HDBSCAN) into per-person groups.
 *   3. Match each cluster to a known child (one labelled face seeds the cluster),
 *      and write `media.child_id`.
 *
 * That ML step needs a native model and real photos, so this module ships the
 * *grouping* layer plus a deterministic fallback that assigns by existing
 * `child_id` and by name tags (the AI captioner already produces tags). It is
 * pure and unit-tested; swapping in real embeddings doesn't change callers. */

export type MediaItem = {
  id: string;
  childId: string | null;
  tags?: string[];
  takenAt?: string;
};

export type Child = { id: string; name: string };

export const UNASSIGNED = 'unassigned';

/** Best-effort child assignment for one item: explicit child_id wins, else a
 * tag matching a child's (lowercased) name. Real impl: nearest face cluster. */
export function assignChild(item: MediaItem, children: Child[]): string {
  if (item.childId) return item.childId;
  const tags = (item.tags ?? []).map((t) => t.toLowerCase());
  const match = children.find((c) => tags.includes(c.name.toLowerCase()));
  return match ? match.id : UNASSIGNED;
}

/** Group media into per-child buckets (plus an `unassigned` bucket). */
export function groupByChild(items: MediaItem[], children: Child[]): Record<string, MediaItem[]> {
  const groups: Record<string, MediaItem[]> = { [UNASSIGNED]: [] };
  for (const c of children) groups[c.id] = [];
  for (const item of items) {
    const id = assignChild(item, children);
    (groups[id] ??= []).push(item);
  }
  return groups;
}

/** The production entry point — clusters faces, then groups. Today it delegates
 * to the deterministic grouping above; Phase 3 replaces the body with the ML
 * pipeline described at the top of this file. */
export async function clusterAndGroup(items: MediaItem[], children: Child[]): Promise<Record<string, MediaItem[]>> {
  // TODO(phase3): detect faces → embed → cluster → match to children.
  return groupByChild(items, children);
}
