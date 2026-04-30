"use client";

import { Task } from "@/types";
import { Check, Trash2, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTask, updateTask } from "@/lib/tasks";
import { refreshSession } from "@/lib/user";
import { redirect } from "next/navigation";

interface TaskItemProps {
  task: Task;
  accessToken: string;
  onDelete: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskItem({ task, onDelete, onUpdate }: TaskItemProps) {
  const [hovered, setHovered] = useState(false);

  async function handleTaskDelete() {
    const accessToken = await refreshSession();

    if (!accessToken) redirect("/login");

    try {
      await deleteTask(accessToken, task.id);

      toast.success("Usunięto zadanie");
      onDelete();
    } catch {
      toast.error("Wystąpił błąd podczas próby usunięcia zadania.");
    }
  }

  async function handleTaskUpdate() {
    const accessToken = await refreshSession();

    if (!accessToken) redirect("/login");

    try {
      await updateTask(accessToken, task.id, {
        completed: !task.completed,
      });

      toast.success("Zaaktualizowano zadanie");

      const updatedTask = { ...task, completed: !task.completed };
      onUpdate(updatedTask);
    } catch {
      toast.error("Wystąpił błąd podczas próby zaaktualizowania zadania.");
    }
  }

  return (
    <motion.div
      className="flex items-start gap-4 group cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, height: 0, margin: 0, padding: 0 }}
      transition={{ duration: 0.3 }}>
      <div
        className={`size-6 rounded-full flex items-center justify-center mt-1 duration-300 ${
          task.completed
            ? "bg-green-600"
            : "bg-zinc-400 group-hover:bg-zinc-500"
        }`}>
        {task.completed && <Check className="text-background size-4" />}
      </div>
      <div className="relative">
        <h5 className="text-lg font-semibold tracking-tighter">{task.title}</h5>
        <div className="mt-2 h-3 w-48 rounded-full bg-zinc-300"></div>
        <div className="mt-1 h-3 w-40 rounded-full bg-zinc-300"></div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute top-0 md:-right-10 -right-5 flex flex-col gap-1"
              initial={{ opacity: 0, scale: 0.5, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -5 }}
              transition={{ duration: 0.2 }}>
              <button
                aria-label="Delete task"
                className="cursor-pointer p-1 transition-colors rounded-full bg-red-300/75 text-red-900 hover:bg-red-300"
                onClick={handleTaskDelete}>
                <Trash2 size={16} />
              </button>
              {task.completed ? (
                <button
                  aria-label="Unmark task completed"
                  className="cursor-pointer p-1 rounded-full bg-yellow-400/75 text-yellow-900 hover:bg-yellow-500 transition-colors"
                  onClick={handleTaskUpdate}>
                  <Undo2 size={16} />
                </button>
              ) : (
                <button
                  aria-label="Mark task completed"
                  className="cursor-pointer p-1 rounded-full bg-green-600/75 text-green-200 hover:bg-green-600 transition-colors"
                  onClick={handleTaskUpdate}>
                  <Check size={16} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
