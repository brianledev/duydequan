import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.contactSettings.findFirst();
    if (!settings) {
      settings = await prisma.contactSettings.create({ data: {} });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Public settings fetch error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
