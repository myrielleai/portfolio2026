import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

export interface InfoCardAction {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export interface InfoCardContent {
  eyebrow?: string;
  title: string;
  body?: string;
  actions: InfoCardAction[];
}

/** Small paper card that pops up from the bottom of the desk for objects that lead somewhere real. */
export default function InfoCard({ content, onClose }: { content: InfoCardContent | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {content && (
        <motion.div
          key={content.title}
          initial={{ opacity: 0, y: 24, rotate: -1.5, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, rotate: -0.6, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="absolute bottom-6 left-1/2 z-40 w-[min(92%,26rem)] -translate-x-1/2 rounded-2xl border border-amber-900/10 bg-[#fbf7ef] p-6 text-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-amber-900/10 hover:text-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>
          {content.eyebrow && <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800/80">{content.eyebrow}</span>}
          <h4 className="mt-1 pr-8 font-display text-2xl font-bold tracking-tight !text-zinc-900">{content.title}</h4>
          {content.body && <p className="mt-2 text-sm leading-relaxed text-zinc-700">{content.body}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            {content.actions.map((a) =>
              a.href ? (
                <a
                  key={a.label}
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] font-semibold tracking-wider transition-opacity hover:opacity-85 ${
                    a.primary ? "bg-zinc-900 text-amber-50" : "border border-zinc-300 text-zinc-800"
                  }`}
                >
                  {a.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] font-semibold tracking-wider transition-opacity hover:opacity-85 ${
                    a.primary ? "bg-zinc-900 text-amber-50" : "border border-zinc-300 text-zinc-800"
                  }`}
                >
                  {a.label}
                </button>
              )
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
