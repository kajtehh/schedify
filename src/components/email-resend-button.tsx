"use client";

import LoadingButton from "./loading-button";
import { useState } from "react";
import { resendVerificationEmail } from "@/lib/auth";
import { toast } from "sonner";

export default function EmailResendButton({
  accessToken,
}: {
  accessToken: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    setTimeout(async () => {
      try {
        const success = await resendVerificationEmail(accessToken);

        if (!success) {
          toast.error(
            "Wystąpił błąd podczas wysyłania emaila. Spróbuj ponownie."
          );
          return;
        }

        toast.success("Wysłano ponownie email weryfikacyjny");
      } catch (error) {
        toast.error(
          "Wystąpił błąd podczas wysyłania emaila. Spróbuj ponownie."
        );
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  return (
    <LoadingButton
      variant="outline"
      className="w-full"
      loading={loading}
      onClick={handleClick}>
      Wyślij ponownie
    </LoadingButton>
  );
}
