"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    thuong: 0,
    vip: 0,
    admin: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/menu?type=thuong&limit=1").then((r) => r.json()),
      fetch("/api/admin/menu?type=vip&limit=1").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ])
      .then(([t, v, u]) => {
        setStats({ thuong: t.total || 0, vip: v.total || 0, admin: u.users?.length || 0 });
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Đã đăng xuất");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1A1A1A", color: "#F5F5DC", border: "1px solid rgba(212,175,55,0.3)" } }} />
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8 lg:ml-64">
        <div className="mb-10">
          <h1 className="text-3xl text-[#D4AF37] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
            TỔNG QUAN
          </h1>
          <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-1 w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Món Menu Thường", value: stats.thuong, icon: "🍲", link: "/admin/menuthuong" },
            { label: "Món Menu VIP", value: stats.vip, icon: "👑", link: "/admin/menuvip" },
            { label: "Tài khoản Admin", value: stats.admin, icon: "👤", link: "/admin/users" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.link}
              className="block bg-[#111] border border-[rgba(212,175,55,0.2)] p-6 hover:border-[#D4AF37] hover:shadow-gold transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "Cinzel, serif" }}>
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-400 text-sm tracking-wider group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "Cinzel, serif" }}>
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Quản lý Menu Thường", href: "/admin/menuthuong", desc: "Thêm, sửa, xóa món thường" },
            { label: "Quản lý Menu VIP", href: "/admin/menuvip", desc: "Thêm, sửa, xóa món VIP" },
            { label: "Quản lý Admin", href: "/admin/users", desc: "Tạo, đặt lại mật khẩu" },
            { label: "Cài đặt liên hệ", href: "/admin/settings", desc: "Zalo, Facebook, điện thoại..." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-[#111] border border-[rgba(212,175,55,0.15)] p-5 hover:border-[rgba(212,175,55,0.5)] hover:bg-[#1A1A1A] transition-all group"
            >
              <span className="text-[#D4AF37] text-xl">◆</span>
              <div>
                <p className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
                  {item.label}
                </p>
                <p className="text-gray-600 text-sm mt-0.5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {item.desc}
                </p>
              </div>
              <span className="ml-auto text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
