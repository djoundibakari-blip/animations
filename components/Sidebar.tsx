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
    <aside
      className="w-60 shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ background: "#0e0e18", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
          >
            <span className="font-black text-xs tracking-[3px]" style={{ color: "#fff" }}>H</span>
          </div>
          <div>
            <p className="font-black text-sm tracking-[0.28em] uppercase leading-none" style={{ color: "#fff" }}>
              Herald
            </p>
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              your news
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 relative"
              style={{
                color: active ? "#fff" : "rgba(255,255,255,0.4)",
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5"
                  style={{ background: "linear-gradient(180deg, #a78bfa, #60a5fa)" }}
                />
              )}
              <span className="text-base leading-none">{item.icon}</span>
              <span className="tracking-[0.02em] text-xs uppercase font-black">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
            {userName}
          </p>
          <p className="text-[10px] font-mono truncate mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
            {userEmail}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.28)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.background = "rgba(239,68,68,0.07)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.28)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
