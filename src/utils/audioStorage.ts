import { VoiceNoteRecord } from '../types';

const DB_NAME = 'agrisaarthi_voice_db';
const DB_VERSION = 1;
const STORE_NAME = 'voice_notes';
const METADATA_STORAGE_KEY = 'agrisaarthi_voice_metadata';

interface StoredVoiceItem {
  id: string;
  title: string;
  cropTag: string;
  recordedAt: number;
  durationSeconds: number;
  blob: Blob;
  noteDescription?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB is not supported in this browser.'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a recorded audio blob into IndexedDB with metadata in localStorage.
 * Confirms physical save before returning success.
 */
export async function saveAudioRecord(
  id: string,
  title: string,
  cropTag: string,
  blob: Blob,
  durationSeconds: number,
  noteDescription?: string
): Promise<{ success: boolean; record?: VoiceNoteRecord; error?: string }> {
  try {
    const db = await openDB();

    const item: StoredVoiceItem = {
      id,
      title: title.trim() || `Field Note ${new Date().toLocaleDateString()}`,
      cropTag: cropTag || 'general',
      recordedAt: Date.now(),
      durationSeconds: Math.round(durationSeconds),
      blob,
      noteDescription: noteDescription?.trim() || '',
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Verification check: confirm the record exists in DB
    const verified = await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(Boolean(req.result && req.result.blob));
      };
      req.onerror = () => resolve(false);
    });

    if (!verified) {
      return { success: false, error: 'Storage verification failed.' };
    }

    // Also sync metadata to localStorage as backup list
    try {
      const metaList = getStoredMetadata();
      const newMeta: VoiceNoteRecord = {
        id,
        title: item.title,
        cropTag: item.cropTag,
        recordedAt: item.recordedAt,
        durationSeconds: item.durationSeconds,
        audioDataSize: blob.size,
        noteDescription: item.noteDescription,
      };
      const updated = [newMeta, ...metaList.filter((m) => m.id !== id)];
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage metadata sync notice:', e);
    }

    const blobUrl = URL.createObjectURL(blob);
    return {
      success: true,
      record: {
        id,
        title: item.title,
        cropTag: item.cropTag,
        recordedAt: item.recordedAt,
        durationSeconds: item.durationSeconds,
        audioBlobUrl: blobUrl,
        audioDataSize: blob.size,
        noteDescription: item.noteDescription,
      },
    };
  } catch (err: any) {
    console.error('Failed to save audio recording:', err);
    return {
      success: false,
      error: err?.message || 'Database write error while saving audio recording.',
    };
  }
}

/**
 * Retrieves all stored voice notes with active Blob URLs for playback.
 */
export async function getAllAudioRecords(): Promise<VoiceNoteRecord[]> {
  try {
    const db = await openDB();
    const storedItems = await new Promise<StoredVoiceItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    // Convert blobs to active object URLs
    const records: VoiceNoteRecord[] = storedItems
      .map((item) => {
        let blobUrl = '';
        if (item.blob) {
          try {
            blobUrl = URL.createObjectURL(item.blob);
          } catch (e) {
            console.warn('Error creating Blob URL for item', item.id, e);
          }
        }
        return {
          id: item.id,
          title: item.title,
          cropTag: item.cropTag,
          recordedAt: item.recordedAt,
          durationSeconds: item.durationSeconds,
          audioBlobUrl: blobUrl,
          audioDataSize: item.blob ? item.blob.size : 0,
          noteDescription: item.noteDescription,
        };
      })
      .sort((a, b) => b.recordedAt - a.recordedAt);

    return records;
  } catch (err) {
    console.warn('IndexedDB read failed, falling back to localStorage metadata:', err);
    return getStoredMetadata();
  }
}

/**
 * Deletes a voice note from IndexedDB and localStorage.
 */
export async function deleteAudioRecord(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const metaList = getStoredMetadata().filter((m) => m.id !== id);
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metaList));
    return true;
  } catch (err) {
    console.error('Failed to delete audio record:', err);
    return false;
  }
}

/**
 * Clears all voice notes for demo reset.
 */
export async function clearAllAudioRecords(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (e) {
    console.warn('Could not clear IndexedDB store:', e);
  }
  localStorage.removeItem(METADATA_STORAGE_KEY);
}

function getStoredMetadata(): VoiceNoteRecord[] {
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
