import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Thiếu mật khẩu" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify password error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
