/* Adapted from the user's recovered Trinity SeededRng, commit
 * 02447f325dd6e6c5d7c8f420ed385368e42a49f1. See reference/ and PROVENANCE.md.
 * The state is explicitly wrapped to uint32; API inputs are validated.
 * This is a seeded non-cryptographic generator, not novel cryptography. */
(() => {
  'use strict';
  const IT = globalThis.IT = globalThis.IT || {};
  class SeededRng {
    constructor(seed) {
      if (!Number.isSafeInteger(seed)) throw new TypeError('Seed must be a safe integer.');
      this.state = seed >>> 0;
    }
    next() {
      this.state = (this.state + 0x6d2b79f5) >>> 0;
      let t = this.state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    nextInt(min, max) {
      if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max || max - min > 0x7fffffff) {
        throw new RangeError('Invalid random integer interval.');
      }
      return Math.floor(this.next() * (max - min + 1)) + min;
    }
    clone() { return new SeededRng(this.state); }
    getState() { return this.state; }
    shuffle(items) {
      const result = [...items];
      for (let i = result.length - 1; i > 0; i--) {
        const j = this.nextInt(0, i);
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
  }
  IT.SeededRng = SeededRng;
})();
