import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen" style={{ background: "#08080e", color: "#fff" }}>
      <Sidebar userName={user.name} userEmail={user.email} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
