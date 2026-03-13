import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const menuType = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: Record<string, unknown> = {};
    if (menuType) where.menu_type = menuType;

    const history = await prisma.menuItemHistory.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: limit,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { password, menuType } = await req.json();
    if (!password) return NextResponse.json({ error: "Thiếu mật khẩu" }, { status: 400 });

    const user = await prisma.adminUser.findUnique({ where: { id: auth.userId } });
    if (!user) return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });

    const where: Record<string, unknown> = {};
    if (menuType) where.menu_type = menuType;

    const { count } = await prisma.menuItemHistory.deleteMany({ where });

    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("History delete error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
