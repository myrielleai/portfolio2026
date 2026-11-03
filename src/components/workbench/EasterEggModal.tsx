import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { playClickSound, playToggleSound } from "../../utils/audio";

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hand-drawn checkbox: a wobbly square, ticked with a pen stroke
function Box({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className="h-6 w-6 shrink-0 overflow-visible" aria-hidden>
      <path d="M4 5.5 C 10 4.2, 18 4.8, 23.5 4.6 C 24 10, 23.6 17, 23.8 23.4 C 17 23.9, 10 23.2, 4.4 23.6 C 4 17, 4.6 10, 4 5.5 Z" fill="none" stroke="#4c1d95" strokeWidth="1.6" strokeLinejoin="round" />
      {done && (
        <motion.path
          d="M7 14.5 L12 20 L27 2"
          fill="none"
          stroke="#7e22ce"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

export default function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "sleep", completed: true },
    { id: 2, text: "matcha", completed: true },
    { id: 3, text: "clean my table", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const toggleTask = (id: number) => {
    playToggleSound(true);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    playClickSound();
    setTasks((prev) => [...prev, { id: Date.now(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText("");
  };

  const deleteTask = (id: number) => {
    playClickSound();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const close = () => {
    playClickSound();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12081c]/55 backdrop-blur-sm cursor-pointer"
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8, rotate: -8, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: -2, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 4, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-[380px] aspect-square cursor-default select-none"
          >
            {/* Paper: lavender, like the note on the desk, slight lift at the bottom-right corner */}
            <div
              className="absolute inset-0 shadow-[0_30px_50px_-20px_rgba(40,10,60,0.55),0_2px_6px_rgba(40,10,60,0.2)]"
              style={{
                background:
                  "linear-gradient(170deg, #f1e4ff 0%, #e9d5ff 55%, #dcc2fb 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)",
              }}
            />
            {/* curled corner */}
            <div
              className="absolute bottom-0 right-0 h-[12%] w-[12%]"
              style={{
                background: "linear-gradient(135deg, #c9a8f3 0%, #eadcff 50%, rgba(0,0,0,0) 51%)",
                filter: "drop-shadow(-3px -3px 4px rgba(60,20,90,0.25))",
              }}
            />
            {/* adhesive strip shading along the top */}
            <div className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-[#7e22ce]/20 to-transparent" />
            {/* washi tape */}
            <div
              className="absolute -top-4 left-1/2 h-8 w-32 -translate-x-1/2 rotate-[3deg] opacity-90"
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(147,51,234,0.45) 0 8px, rgba(233,213,255,0.6) 8px 16px)",
                maskImage: "linear-gradient(90deg, transparent 0, #000 6px, #000 calc(100% - 6px), transparent 100%)",
              }}
            />

            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-[#6b21a8]/70 transition hover:bg-[#6b21a8]/10 hover:text-[#3b0764] cursor-pointer"
              aria-label="Close note"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex h-full flex-col px-8 pb-8 pt-10 font-bold text-[#4c1d95]" style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}>
              <h3 className="text-[28px] leading-none font-bold text-[#3b0764]">📌 TO DO</h3>
              <span className="mt-2 block h-[3px] w-[42%] rounded-full bg-[#9333ea]" />

              {/* Ruled lines with the tasks written on them */}
              <div
                className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1"
                data-lenis-prevent
                style={{
                  backgroundImage: "repeating-linear-gradient(180deg, transparent 0 39px, rgba(126,34,206,0.22) 39px 40px)",
                  backgroundAttachment: "local",
                }}
              >
                <AnimatePresence initial={false}>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="group flex h-10 items-center gap-3"
                    >
                      <button onClick={() => toggleTask(task.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer">
                        <Box done={task.completed} />
                        <span className={`relative truncate text-[19px] leading-none ${task.completed ? "text-[#7e22ce]" : ""}`}>
                          {task.text}
                          {task.completed && (
                            <motion.span
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-[-2px] right-[-2px] top-[55%] h-[2.5px] origin-left -rotate-1 rounded-full bg-[#7e22ce]/60"
                            />
                          )}
                        </span>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="shrink-0 text-[22px] leading-none text-[#9333ea] opacity-0 transition group-hover:opacity-80 hover:!opacity-100 cursor-pointer"
                        aria-label={`Erase ${task.text}`}
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Write a new line */}
                <form onSubmit={handleAddTask} className="flex h-10 items-center gap-3">
                  <span className="w-6 text-center text-[22px] leading-none text-[#6b21a8]/70">+</span>
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="write something..."
                    className="min-w-0 flex-1 bg-transparent text-[19px] font-bold leading-none text-[#4c1d95] placeholder:text-[#6b21a8]/45 focus:outline-none"
                  />
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
