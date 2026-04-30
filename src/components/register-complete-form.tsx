"use client";

import Input from "@/components/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { completeRegistration } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import AuthCard from "@/components/auth-card";
import { isValidFullName } from "@/utils/validation";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import { refreshSession } from "@/lib/user";

type FormData = {
  fullName: string;
};

export default function RegisterCompleteForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoading) return;

    setLoading(true);

    setTimeout(async () => {
      try {
        const accessToken = await refreshSession();

        if (!accessToken) redirect("/login");

        await completeRegistration(data.fullName, accessToken);

        router.push("/app");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        toast.error(`Wystąpił błąd podczas ukończenia rejestracji. ${message}`);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <AuthCard
      subtitle="Konto założone, teraz dokończ rejestrację."
      title="Prawie gotowe!">
      <form
        className="space-y-6 relative z-10"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-zinc-800">
            Twoje pełne imie
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="Jan Kowalski"
            disabled={isLoading}
            required
            {...register("fullName", {
              required: "Pełne imie jest wymagane",
              validate: (value) =>
                isValidFullName(value) || "Nieprawidłowe pełne imie",
            })}
          />
        </div>
        <LoadingButton loading={isLoading} type="submit">
          Zapisz
        </LoadingButton>
      </form>
    </AuthCard>
  );
}
