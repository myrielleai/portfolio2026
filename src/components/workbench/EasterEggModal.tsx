import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Square, Plus, Trash2 } from "lucide-react";
import { playClickSound, playToggleSound } from "../../utils/audio";

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "sleep", completed: true },
    { id: 2, text: "matcha", completed: true },
    { id: 3, text: "Discover all workbench secrets ✨", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const toggleTask = (id: number) => {
    playToggleSound(true);
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    playClickSound();
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: newTaskText.trim(), completed: false }
    ]);
    setNewTaskText("");
  };

  const deleteTask = (id: number) => {
    playClickSound();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: -1 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md aspect-square bg-yellow-200 text-zinc-900 rounded-none p-6 sm:p-7 shadow-2xl border-4 border-yellow-300 font-sans select-none overflow-hidden flex flex-col justify-between cursor-default"
        >
          {/* Adhesive Tape Accent at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-yellow-400/40 backdrop-blur-xs border border-yellow-500/30 rotate-1 shadow-xs rounded-none pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 text-zinc-700 hover:text-black bg-yellow-300/80 hover:bg-yellow-400 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-2xl font-extrabold text-zinc-950 mb-3 flex items-center justify-between">
            <span className="font-serif italic">
              <span>To do</span>
            </span>
          </h3>

          {/* Task List */}
          <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1 my-2">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`group flex items-center justify-between p-2.5 rounded-none border transition-all cursor-pointer ${
                  task.completed
                    ? "bg-yellow-300/50 border-yellow-400/80 text-zinc-600"
                    : "bg-yellow-100/90 border-yellow-300 text-zinc-900 hover:bg-yellow-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-amber-700 shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-mono font-semibold truncate ${
                      task.completed ? "line-through text-zinc-500" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-amber-800 hover:text-red-700 hover:bg-yellow-300/60 rounded-none transition-all cursor-pointer shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Task Input */}
          <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-yellow-100/90 border border-yellow-400/80 rounded-none px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-amber-800/60 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs px-3 py-2 rounded-none flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
