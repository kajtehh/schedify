import DashboardGrid from "@/components/dashboard-grid";
import { getUserTasks } from "@/lib/tasks";
import { getUserSession } from "@/lib/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) redirect("/login");

  const session = await getUserSession(refreshToken);
  if (!session) redirect("/login");

  const { user, accessToken } = session;

  if (!user.emailVerifiedAt) redirect("/verify-email/reminder");
  if (!user.fullName) redirect("/register/complete");

  return { user, accessToken };
}

export default async function App() {
  const { user, accessToken } = await requireAuth();

  const tasks = await getUserTasks(accessToken);

  if (!tasks) return null;

  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const formattedDate = date.toLocaleDateString("pl-PL", options);
  const finalDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="mt-20 max-w-7xl">
      <div className="space-y-3 mb-8">
        <h2 className="text-4xl tracking-tighter font-medium">
          Witaj, <strong>{user.fullName?.split(" ")[0]}</strong>
        </h2>
        <h1 className="text-6xl tracking-tighter font-semibold">{finalDate}</h1>
      </div>

      <DashboardGrid tasks={tasks} accessToken={accessToken} />
    </div>
  );
}
