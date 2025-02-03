import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { File as DbFile } from "@prisma/client";
import prisma from "@/prisma";

export async function GET() {
  const files = await prisma.file.findMany();
  return NextResponse.json(files);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  const uploadedFiles: DbFile[] = [];

  const folder = await prisma.folder.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
  });

  for (const file of files) {
    const slug = `${folder.id}_${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
    const filePath = path.join(uploadDir, slug);

    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const uploadedFile = await prisma.file.create({
      data: {
        name: slug,
        size: file.size,
        type: file.type,
        folderId: folder.id,
      },
    });

    uploadedFiles.push(uploadedFile);
  }

  await prisma.folder.update({
    where: { id: folder.id },
    data: {
      files: { connect: uploadedFiles.map((file) => ({ id: file.id })) },
    },
  });

  return NextResponse.json(folder);
}
