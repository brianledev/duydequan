import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.contactSettings.findFirst();
    if (!settings) {
      settings = await prisma.contactSettings.create({ data: {} });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id: _id, ...data } = await req.json();

    let settings = await prisma.contactSettings.findFirst();
    if (!settings) {
      settings = await prisma.contactSettings.create({ data });
    } else {
      settings = await prisma.contactSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
