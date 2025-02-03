import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const files = await prisma.folder.findMany({
    include: {
      files: true,
    },
  });
  return NextResponse.json(files);
}
