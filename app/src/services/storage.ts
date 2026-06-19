/* Cloud photo/video sync interface.
 *
 * MOCK today: reports a static quota matching the design (4.8 / 5 GB). Phase 2
 * replaces this with real object storage (upload, CDN delivery, quota) behind
 * the same signatures. Premium lifts the quota to unlimited. */

export type Quota = { usedGb: number; totalGb: number | 'unlimited' };

export async function getQuota(premium: boolean): Promise<Quota> {
  // TODO(phase2): query real usage.
  return premium ? { usedGb: 4.8, totalGb: 'unlimited' } : { usedGb: 4.8, totalGb: 5 };
}
