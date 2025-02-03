import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> },
) {
  const { folderId } = await params;

  const folder = await prisma.folder.findUnique({
    include: { files: true },
    where: { id: folderId },
  });

  return NextResponse.json(folder);
}
