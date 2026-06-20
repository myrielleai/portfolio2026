// src/lenis.d.ts
declare module "lenlenis" {};

declare module "lenis" {
  interface LenisOptions {
    // Add any options you use; keep generic any for now
    [key: string]: any;
  }
  export default class Lenis {
    constructor(options?: LenisOptions);
    on(event: string, callback: () => void): void;
    raf(time: number): void;
    destroy(): void;
  }
}
