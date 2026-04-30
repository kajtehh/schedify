"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUser } from "@/lib/user";

export function UserWatcher({
  accessToken,
  target,
}: {
  accessToken: string;
  target: "email-verify" | "full-name";
}) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = await getUser(accessToken);

      if (!user) {
        router.push("/login");
        return;
      }

      switch (target) {
        case "email-verify":
          if (!user.emailVerifiedAt) return;

          toast.success("Email zweryfikowany!");
          router.push("/app");
          break;
        case "full-name":
          if (!user.fullName) return;

          router.push("/app");
          break;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [accessToken, router]);

  return null;
}
