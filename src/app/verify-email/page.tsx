import { verifyEmail } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = (await searchParams).token;

  if (!token) {
    redirect("/verify-email/reminder");
  }

  if (await verifyEmail(token)) {
    redirect("/app");
  }

  redirect("/verify-email/reminder");
}
