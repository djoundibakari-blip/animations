"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "▦" },
  { href: "/chat", label: "Assistant Herald", icon: "◎" },
  { href: "/profile", label: "Mon profil", icon: "◉" },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export default function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-herald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">H</span>
          </div>
          <div>
            <p className="font-black text-herald-700 text-lg leading-none">HERALD</p>
            <p className="text-xs text-slate-400 font-mono">your news</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-herald-50 text-herald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
          <p className="text-xs text-slate-400 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
