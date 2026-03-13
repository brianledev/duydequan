"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onLogout: () => void;
}

const navItems = [
  { href: "/admin", label: "Tổng Quan", icon: "◉" },
  { href: "/admin/menuthuong", label: "Menu Thường", icon: "🍲" },
  { href: "/admin/menuvip", label: "Menu VIP", icon: "👑" },
  { href: "/admin/users", label: "Quản lý Admin", icon: "👤" },
  { href: "/admin/settings", label: "Cài đặt liên hệ", icon: "⚙" },
];

export default function AdminSidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0D0D0D] border-r border-[rgba(212,175,55,0.15)] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(212,175,55,0.15)] flex items-center gap-3">
          <Image src="/images/logo.png" alt="Duy Dê 2" width={60} height={60} className="object-contain" />
          <div>
            <h2
              className="text-[#D4AF37] text-lg font-bold"
              style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
            >
              DUY DÊ 2
            </h2>
            <p className="text-gray-600 text-xs mt-1 tracking-widest" style={{ fontFamily: "Cinzel, serif" }}>
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all text-sm ${
                  isActive
                    ? "border-[#D4AF37] bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                    : "border-transparent text-gray-400 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.3)]"
                }`}
                style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(212,175,55,0.15)] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] text-xs tracking-wider px-4 py-2 transition-colors"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            <span>↗</span> Xem trang web
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs tracking-wider px-4 py-2 transition-colors"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            <span>⎋</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden bg-[#0D0D0D] border-b border-[rgba(212,175,55,0.15)] px-4 py-3 flex items-center justify-between">
        <h2 className="text-[#D4AF37] text-sm font-bold flex items-center gap-2" style={{ fontFamily: "Cinzel, serif" }}>
          <Image src="/images/logo.png" alt="Duy Dê 2" width={36} height={36} className="object-contain" />
          DUY DÊ 2 – ADMIN
        </h2>
        <button onClick={onLogout} className="text-gray-500 hover:text-red-400 text-xs" style={{ fontFamily: "Cinzel, serif" }}>
          ĐĂNG XUẤT
        </button>
      </div>

      {/* Mobile nav */}
      <nav className="lg:hidden flex overflow-x-auto bg-[#0D0D0D] border-b border-[rgba(212,175,55,0.1)] px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 px-3 py-2 text-xs border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : "border-transparent text-gray-500 hover:text-[#D4AF37]"
              }`}
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
