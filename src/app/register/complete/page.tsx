import RegisterCompleteForm from "@/components/register-complete-form";
import { UserWatcher } from "@/components/user-watcher";
import { getUserSession } from "@/lib/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterCompletePage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) redirect("/login");

  const session = await getUserSession(refreshToken);

  if (!session) redirect("/login");

  const { user, accessToken } = session;

  if (user.fullName) redirect("/app");

  return (
    <>
      <UserWatcher accessToken={accessToken} target="full-name" />
      <RegisterCompleteForm accessToken={accessToken} />
    </>
  );
}
