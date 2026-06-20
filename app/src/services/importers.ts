/* Photo import sources.
 *
 * Lets the user bring photos in from several places. Honest constraints:
 *  - device  — the OS photo library. On iOS this IS iCloud Photos; on Android
 *              it's the local / Google Photos library. (native picker)
 *  - gdrive  — Google Drive via its REST API (OAuth). Real when a Google client
 *              id + access token are available; mock otherwise.
 *  - files   — a file picker for photos exported from other apps. FamilyAlbum
 *              (Mitene) has no public API, so the flow is: export from
 *              FamilyAlbum to your device, then import the files here.
 *
 * Each importer returns renderable items; non-demo items are handed to the
 * upload queue. Everything has a mock fallback so the picker is explorable
 * with no backend. */
import { pickFromLibrary } from './photos';
import { G } from '../data/content';

export type SourceId = 'device' | 'gdrive' | 'files';

export type ImportSource = {
  id: SourceId;
  label: string;
  hint: string;
  /** True when this source can do a *real* import (vs. a demo placeholder). */
  ready: boolean;
};

export type ImportedPhoto = {
  id: string;
  name: string;
  /** A usable URL: file:// (device), object URL (files/drive), or a gradient (demo). */
  src: string;
  isGradient: boolean;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function listSources(): ImportSource[] {
  return [
    { id: 'device', label: 'Photos (iCloud / device)', hint: 'Your phone’s photo library', ready: true },
    { id: 'gdrive', label: 'Google Drive', hint: GOOGLE_CLIENT_ID ? 'Connected' : 'Connect to import', ready: Boolean(GOOGLE_CLIENT_ID) },
    { id: 'files', label: 'Files (FamilyAlbum export…)', hint: 'Export from FamilyAlbum, then pick the files', ready: true },
  ];
}

export async function importFrom(id: SourceId): Promise<ImportedPhoto[]> {
  if (id === 'device') return importDevice();
  if (id === 'files') return importFiles();
  return importGoogleDrive();
}

/* ---- device (OS photo library / iCloud) ---- */
async function importDevice(): Promise<ImportedPhoto[]> {
  const p = await pickFromLibrary(); // real picker on device; gradient on web
  if (!p) return [];
  return [{ id: p.id, name: p.id.split('/').pop() || 'photo.jpg', src: p.src, isGradient: p.isGradient }];
}

/* ---- files (FamilyAlbum exports, Downloads, etc.) ---- */
async function importFiles(): Promise<ImportedPhoto[]> {
  if (typeof document === 'undefined') return [];
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      resolve(files.map((f, i) => ({
        id: 'file-' + i + '-' + f.name,
        name: f.name,
        src: URL.createObjectURL(f),
        isGradient: false,
      })));
    };
    // If the dialog is dismissed with no selection, resolve empty on focus return.
    window.addEventListener('focus', () => setTimeout(() => resolve([]), 300), { once: true });
    input.click();
  });
}

/* ---- Google Drive (REST) ---- */
async function importGoogleDrive(): Promise<ImportedPhoto[]> {
  const token = await getGoogleAccessToken();
  if (!token) {
    // Not connected → demo placeholders so the flow is explorable.
    return [2, 7, 10].map((i, k) => ({ id: 'gd' + k, name: `drive-${k}.jpg`, src: G[i % G.length], isGradient: true }));
  }
  try {
    const q = encodeURIComponent("mimeType contains 'image/' and trashed = false");
    const list = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=30&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${token}` } },
    ).then((r) => r.json());
    const files: { id: string; name: string }[] = list.files ?? [];
    const out: ImportedPhoto[] = [];
    for (const f of files.slice(0, 30)) {
      const blob = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.blob());
      out.push({ id: f.id, name: f.name, src: URL.createObjectURL(blob), isGradient: false });
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Obtain a Google OAuth access token with the Drive read-only scope.
 * Integration point: wire a Google sign-in flow (e.g. @codetrix-studio/
 * capacitor-google-auth, or a PKCE flow via @capacitor/browser) and return its
 * access token. Returns null until configured → Drive import runs in demo mode.
 */
async function getGoogleAccessToken(): Promise<string | null> {
  if (!GOOGLE_CLIENT_ID) return null;
  // TODO(import): exchange GOOGLE_CLIENT_ID via OAuth (scope
  // https://www.googleapis.com/auth/drive.readonly) and return the access token.
  return null;
}
