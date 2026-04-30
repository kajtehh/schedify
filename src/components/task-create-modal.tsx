"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { CalendarPlus } from "lucide-react";
import Input from "./input";
import LoadingButton from "./loading-button";
import { useState } from "react";
import { toast } from "sonner";
import { createTask } from "@/lib/tasks";
import Modal from "./modal";
import { Task } from "@/types";
import { redirect } from "next/navigation";
import { refreshSession } from "@/lib/user";

type FormData = {
  title: string;
  description?: string;
};

interface TaskCreateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (newTask: Task) => void;
}

export default function TaskCreateModal({
  open,
  setOpen,
  onCreate,
}: TaskCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoading) return;

    setLoading(true);

    setTimeout(async () => {
      const accessToken = await refreshSession();

      if (!accessToken) redirect("/login");

      try {
        const createdTask = await createTask(
          accessToken,
          data.title,
          data.description
        );

        reset();
        onCreate(createdTask);

        setOpen(false);
        toast.success("Stworzono zadanie");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(`Wystąpił błąd podczas tworzenia zadania. ${message}`);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <Modal open={open} setOpen={setOpen} onClose={reset}>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Formularz tworzenia zadania">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
          Tworzenie zadania <CalendarPlus className="text-zinc-700" />
        </h2>

        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-800">
            Tytuł zadania <span className="text-red-600">*</span>
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Wykonać zadanie"
            disabled={isLoading}
            {...register("title", {
              required: "Tytuł zadania jest wymagany",
            })}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-800">
            Opis zadania
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Lorem ipsum dolor sit amet."
            disabled={isLoading}
            {...register("description")}
          />
        </div>

        <div className="pt-2">
          <LoadingButton loading={isLoading} className="w-full" type="submit">
            Stwórz
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
