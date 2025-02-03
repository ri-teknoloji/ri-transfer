import prisma from "@/prisma";
import AdmZip from "adm-zip";
import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> },
) {
  const { folderId } = await params;

  const folder = await prisma.folder.findUnique({
    include: { files: true },
    where: { id: folderId },
  });

  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  const zip = new AdmZip();

  for (const file of folder.files) {
    const filePath = path.join(process.cwd(), "public/uploads", file.name);
    const fileBuffer = await readFile(filePath);
    zip.addFile(file.name, fileBuffer);
  }

  const zipBuffer = zip.toBuffer();
  const filePath = `public/uploads/${folderId}.zip`;

  await writeFile(filePath, zipBuffer);

  return NextResponse.json({ path: filePath });
}
