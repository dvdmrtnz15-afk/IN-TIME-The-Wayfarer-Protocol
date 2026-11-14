// Recovered through read-only Replit inspection of Trinity LS IP - do not delete.
// HEAD 02447f325dd6e6c5d7c8f420ed385368e42a49f1
// Original: src/alive-world-engine/rng.ts. Original code below; no license reassignment.
export class SeededRng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return result;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  clone(): SeededRng { const cloned = new SeededRng(0); cloned.state = this.state; return cloned; }
  getState(): number { return this.state; }
}
