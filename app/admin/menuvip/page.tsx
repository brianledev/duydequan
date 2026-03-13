"use client";

import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import MenuTable from "@/components/admin/MenuTable";

export default function MenuVIPPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Đã đăng xuất");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] lg:flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1A1A1A", color: "#F5F5DC", border: "1px solid rgba(212,175,55,0.3)" } }} />
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-4 lg:p-8 lg:ml-64">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-3xl text-[#D4AF37] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
            QUẢN LÝ MENU VIP
          </h1>
          <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-1 w-40" />
          <p className="text-gray-500 text-sm" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}>
            Quản lý thực đơn dành cho phòng VIP
          </p>
        </div>

        <MenuTable menuType="vip" />
      </main>
    </div>
  );
}
