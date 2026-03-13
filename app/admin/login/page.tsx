"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đăng nhập thành công!");
        router.push("/admin");
      } else {
        toast.error(data.error || "Đăng nhập thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, #111 0%, #0A0A0A 70%)",
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#F5F5DC",
            border: "1px solid rgba(212,175,55,0.3)",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="Duy Dê 2" className="h-16 w-auto object-contain" />
          </div>
          <h1
            className="text-3xl text-[#D4AF37] mb-2"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.1em" }}
          >
            DUY DÊ 2
          </h1>
          <div className="gold-divider mb-3" />
          <p
            className="text-gray-500 text-sm tracking-widest"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            QUẢN TRỊ HỆ THỐNG
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#111] border border-[rgba(212,175,55,0.2)] p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                className="block text-[#D4AF37] text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
              />
            </div>

            <div>
              <label
                className="block text-[#D4AF37] text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-sm tracking-widest uppercase disabled:opacity-60"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
            </button>
          </form>
        </div>

        <p
          className="text-center text-gray-600 text-xs mt-6"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          © Duy Dê 2 — Chỉ dành cho quản trị viên
        </p>
      </motion.div>
    </div>
  );
}
