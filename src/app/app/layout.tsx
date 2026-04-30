import Sidebar from "@/components/sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 pl-16">
        <main className="xl:p-6 p-4">{children}</main>
      </div>
    </div>
  );
}
