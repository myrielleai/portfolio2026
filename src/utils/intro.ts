// Where the opening preloader is, so heavy work can wait for a moment when it won't show:
//   loading → the logo is animating: keep the main thread free
//   quiet   → the count rests at 97% and nothing moves: a good time for one-off heavy work
//   done    → the preloader is lifting (or never showed): run normally
// It only moves forward, so pages visited later in the session see "done" straight away.
export type IntroPhase = "loading" | "quiet" | "done";

const RANK: Record<IntroPhase, number> = { loading: 0, quiet: 1, done: 2 };
let phase: IntroPhase = "loading";
const listeners = new Set<(p: IntroPhase) => void>();

export function setIntroPhase(next: IntroPhase) {
  if (RANK[next] <= RANK[phase]) return;
  phase = next;
  listeners.forEach((fn) => fn(next));
}

/** Runs `cb` once the intro reaches `at` (right away if it already has). Returns a cancel function. */
export function whenIntro(at: IntroPhase, cb: () => void): () => void {
  if (RANK[phase] >= RANK[at]) {
    cb();
    return () => {};
  }
  const fn = (p: IntroPhase) => {
    if (RANK[p] < RANK[at]) return;
    listeners.delete(fn);
    cb();
  };
  listeners.add(fn);
  return () => listeners.delete(fn);
}
