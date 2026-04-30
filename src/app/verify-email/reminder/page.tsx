import AuthCard from "@/components/auth-card";
import Button from "@/components/button";
import EmailResendButton from "@/components/email-resend-button";
import { UserWatcher } from "@/components/user-watcher";
import { getUserSession } from "@/lib/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifyEmailReminderPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) redirect("/login");

  const session = await getUserSession(refreshToken);

  if (!session) redirect("/login");

  const { user, accessToken } = session;

  return (
    <AuthCard
      title="Zweryfikuj swój email"
      subtitle="Proszę zweryfikuj adres email, aby kontynuować">
      <p className="mb-4 text-sm text-zinc-700">
        Sprawdź swoją{" "}
        <span className="text-foreground font-medium">
          skrzynkę pocztową {`(${user.email})`}
        </span>{" "}
        i kliknij link weryfikacyjny. Jeśli nie otrzymałeś wiadomości, możesz
        wysłać ją ponownie.
      </p>

      <div className="flex md:flex-row flex-col gap-2">
        <Button href="/app" className="flex items-center justify-center">
          Zweryfikowano
        </Button>

        <EmailResendButton accessToken={accessToken} />
      </div>
      <UserWatcher accessToken={accessToken} target="email-verify" />
    </AuthCard>
  );
}
