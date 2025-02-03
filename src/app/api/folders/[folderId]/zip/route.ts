import s3 from "@/lib/s3";
import prisma from "@/prisma";
import AdmZip from "adm-zip";
import axios from "axios";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

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
    const { data } = await axios.get(file.cloudKey, {
      baseURL: process.env.NEXT_PUBLIC_CDN_URL,
      responseType: "arraybuffer",
    });
    const fileBuffer = Buffer.from(data);
    zip.addFile(file.name, fileBuffer);
  }

  const key = `zips/${folderId}.zip`;

  await s3.createFile(key, zip.toBuffer());

  const zipBuffer = zip.toBuffer();
  const filePath = `public/uploads/${folderId}.zip`;

  await writeFile(filePath, zipBuffer);

  return NextResponse.json({ path: filePath });
}
