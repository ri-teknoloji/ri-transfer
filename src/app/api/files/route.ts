import s3 from "@/lib/s3";
import prisma from "@/prisma";
import { File as DbFile } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

  const uploadedFiles: DbFile[] = [];

  const folder = await prisma.folder.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    },
  });

  for (const file of files) {
    const slug = `${folder.id}/${file.name.replace(/[^a-z0-9.]/gi, "_")}`;

    await s3.createFile(slug, Buffer.from(await file.arrayBuffer()));

    const uploadedFile = await prisma.file.create({
      data: {
        cloudKey: slug,
        folderId: folder.id,
        name: slug,
        size: file.size,
        type: file.type,
      },
    });

    uploadedFiles.push(uploadedFile);
  }

  await prisma.folder.update({
    data: {
      files: { connect: uploadedFiles.map((file) => ({ id: file.id })) },
    },
    where: { id: folder.id },
  });

  return NextResponse.json(folder);
}
