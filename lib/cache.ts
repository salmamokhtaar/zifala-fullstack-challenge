type Entry<T> = { value: T; expires: number };

export class TTLCache<T> {
  private store = new Map<string, Entry<T>>();
  constructor(private max = 1000, private ttlMs = 30 * 60 * 1000) {}

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return;
    if (Date.now() > hit.expires) { this.store.delete(key); return; }
    return hit.value;
  }

  set(key: string, value: T) {
    if (this.store.size >= this.max) {
      // naive LRU-ish: delete first key
      const k = this.store.keys().next().value;
      if (k) this.store.delete(k);
    }
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }
}

export const distancesCache = new TTLCache<any>(1000, 30 * 60 * 1000);
export const keyFromCodes = (codes: string[]) => codes.slice().sort().join("|");
