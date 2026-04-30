"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import TaskItem from "./task-item";
import { Task } from "@/types";
import TaskCreateModal from "./task-create-modal";
import Button from "./button";
import { CirclePlus } from "lucide-react";
import { sortTasks } from "@/lib/tasks";

export default function TaskList({
  tasks,
  setTasks,
  accessToken,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  accessToken: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (taskId: string) => {
    setTasks((tasks) => sortTasks(tasks.filter((t) => t.id !== taskId)));
  };

  const handleUpdate = (updatedTask: Task) => {
    setTasks((tasks) =>
      sortTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
    );
  };

  const handleCreate = (newTask: Task) => {
    setTasks((prev) => sortTasks([newTask, ...prev]));
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 min-h-40">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex items-center justify-center border border-dashed border-zinc-400 rounded-md select-none">
              <p className="text-zinc-500 tracking-tighter font-medium">
                Brak zadań
              </p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  height: 0,
                  margin: 0,
                  padding: 0,
                }}
                transition={{ duration: 0.3 }}>
                <TaskItem
                  accessToken={accessToken}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onUpdate={(updatedTask) => handleUpdate(updatedTask)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <TaskCreateModal
        accessToken={accessToken}
        setOpen={setModalOpen}
        open={modalOpen}
        onCreate={handleCreate}
      />

      <div className="mt-8">
        <Button
          className="flex gap-1.5 items-center"
          onClick={() => setModalOpen(true)}>
          <CirclePlus size={"1.15em"} />
          Dodaj zadanie
        </Button>
      </div>
    </>
  );
}
