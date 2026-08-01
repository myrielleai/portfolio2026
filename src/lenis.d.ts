// src/lenis.d.ts
declare module "lenis" {
  interface LenisOptions {
    [key: string]: unknown;
  }
  export default class Lenis {
    constructor(options?: LenisOptions);
    on(event: string, callback: () => void): void;
    raf(time: number): void;
    destroy(): void;
  }
}

