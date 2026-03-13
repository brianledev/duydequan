import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, username: true, created_at: true },
      orderBy: { created_at: "asc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 8 ký tự" },
        { status: 400 }
      );
    }

    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã tồn tại" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.create({
      data: { username, password_hash },
      select: { id: true, username: true, created_at: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
