"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { AdminUser } from "@/types";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetModal, setResetModal] = useState<AdminUser | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Xóa tài khoản "${username}"?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      toast.success("Đã xóa tài khoản");
      fetchUsers();
    } else {
      toast.error(data.error || "Lỗi xóa tài khoản");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] lg:flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1A1A1A", color: "#F5F5DC", border: "1px solid rgba(212,175,55,0.3)" } }} />
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-4 lg:p-8 lg:ml-64">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-3xl text-[#D4AF37] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
            QUẢN LÝ ADMIN
          </h1>
          <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-1 w-40" />
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold px-6 py-2 text-sm tracking-wider"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            + Tạo Admin Mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#D4AF37] animate-pulse" style={{ fontFamily: "Cinzel, serif" }}>ĐANG TẢI...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="luxury-table w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Tên đăng nhập</th>
                  <th className="text-left hidden sm:table-cell">Ngày tạo</th>
                  <th className="text-center w-48">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td className="text-gray-600 text-sm">{idx + 1}</td>
                    <td>
                      <span className="text-white font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>
                        {user.username}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm hidden sm:table-cell">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setResetModal(user)}
                          className="text-xs px-2 sm:px-3 py-1 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-colors"
                          style={{ fontFamily: "Cinzel, serif" }}
                        >
                          <span className="hidden sm:inline">Đặt lại </span>Mật khẩu
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="text-xs px-3 py-1 border border-[rgba(220,50,50,0.3)] text-red-400 hover:bg-[rgba(220,50,50,0.1)] transition-colors"
                          style={{ fontFamily: "Cinzel, serif" }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add modal */}
      {showAddModal && (
        <UserModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchUsers(); }}
        />
      )}

      {/* Reset modal */}
      {resetModal && (
        <UserModal
          mode="reset"
          user={resetModal}
          onClose={() => setResetModal(null)}
          onSuccess={() => { setResetModal(null); toast.success("Đã đặt lại mật khẩu"); }}
        />
      )}
    </div>
  );
}

interface UserModalProps {
  mode: "add" | "reset";
  user?: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    setSaving(true);
    try {
      if (mode === "add") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Đã tạo tài khoản");
          onSuccess();
        } else {
          toast.error(data.error || "Lỗi tạo tài khoản");
        }
      } else {
        const res = await fetch(`/api/admin/users/${user!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (res.ok) onSuccess();
        else toast.error(data.error || "Lỗi đặt lại mật khẩu");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-[rgba(212,175,55,0.3)] w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[#D4AF37] text-lg mb-6" style={{ fontFamily: "Cinzel, serif" }}>
          {mode === "add" ? "TẠO ADMIN MỚI" : `ĐẶT LẠI MẬT KHẨU — ${user?.username}`}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "add" && (
            <div>
              <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Tên đăng nhập *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
              />
            </div>
          )}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Mật khẩu mới *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Xác nhận mật khẩu *</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 btn-gold py-3 text-sm tracking-wider disabled:opacity-60" style={{ fontFamily: "Cinzel, serif" }}>
              {saving ? "ĐANG LƯU..." : "XÁC NHẬN"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 btn-outline-gold text-sm" style={{ fontFamily: "Cinzel, serif" }}>HỦY</button>
          </div>
        </form>
      </div>
    </div>
  );
}
