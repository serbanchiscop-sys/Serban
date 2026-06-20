/* Import sources — registry + offline dispatch (no Google config in tests). */
import { describe, it, expect } from 'vitest';
import { listSources, importFrom } from '../services/importers';

describe('import sources', () => {
  it('lists device, gdrive and files', () => {
    const ids = listSources().map((s) => s.id);
    expect(ids).toEqual(['device', 'gdrive', 'files']);
  });

  it('marks Google Drive not-ready without a client id', () => {
    const gdrive = listSources().find((s) => s.id === 'gdrive')!;
    expect(gdrive.ready).toBe(false);
  });

  it('Google Drive import returns demo placeholders when not connected', async () => {
    const photos = await importFrom('gdrive');
    expect(photos.length).toBeGreaterThan(0);
    expect(photos.every((p) => p.isGradient)).toBe(true);
  });
});
