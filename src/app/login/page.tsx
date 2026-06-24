"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { GoogleIcon } from "@/components/icons";
import CustomLink from "@/components/custom-link";
import { SubmitHandler, useForm } from "react-hook-form";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import { loginOrRegister } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Divider from "@/components/divider";
import AuthCard from "@/components/auth-card";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoading) return;

    setLoading(true);

    setTimeout(async () => {
      try {
        await loginOrRegister("/api/auth/login", data.email, data.password);

        toast.success("Zalogowano!");

        router.push("/app");
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        toast.error(`Wystąpił błąd podczas logowania: ${error}`);
        setLoading(false);
      }
    }, 500);
  };

  return (
    <AuthCard subtitle="Witaj ponownie" title="Zaloguj się">
      <form
        className="space-y-6 relative z-10"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-800">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Podaj swój email"
            disabled={isLoading}
            required
            {...register("email", {
              required: "Email jest wymagany",
              validate: (value) => isValidEmail(value) || "Nieprawidłowy email",
            })}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-800">
            Hasło
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Podaj swoje hasło"
            disabled={isLoading}
            required
            {...register("password", {
              required: "Hasło jest wymagane",
              validate: (value) =>
                isValidPassword(value) || "Nieprawidłowy format hasła",
            })}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <CustomLink href="/register" className="underline-hover-effect">
            Nie mam konta
          </CustomLink>
          <CustomLink href="/recover" className="underline-hover-effect">
            Nie pamiętam hasła
          </CustomLink>
        </div>

        <div>
          <LoadingButton loading={isLoading} type="submit">
            Zaloguj się
          </LoadingButton>
          <p className="text-red-600">{error}</p>
        </div>
      </form>

      <Divider>lub</Divider>

      <Button
        className="w-full flex items-center justify-center gap-2 relative z-10"
        disabled={isLoading}>
        <GoogleIcon size={"24"} />
        Kontynuuj z Google
      </Button>
    </AuthCard>
  );
}
