import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 8 ký tự" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await prisma.adminUser.update({
      where: { id },
      data: { password_hash },
      select: { id: true, username: true, created_at: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Count remaining admins - don't allow deleting the last admin
    const count = await prisma.adminUser.count();
    if (count <= 1) {
      return NextResponse.json(
        { error: "Không thể xóa tài khoản admin cuối cùng" },
        { status: 400 }
      );
    }

    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
