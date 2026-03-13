"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Login page doesn't need auth check — it IS the auth page
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) router.push("/admin/login");
        else setChecked(true);
      })
      .catch(() => router.push("/admin/login"));
  }, [router, isLoginPage]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div
          className="text-[#D4AF37] animate-pulse tracking-[0.2em]"
          style={{ fontFamily: "serif", fontSize: "0.875rem" }}
        >
          ĐANG TẢI...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
