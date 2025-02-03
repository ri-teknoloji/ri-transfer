import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import http from "@/lib/http";
import { File, Folder } from "@prisma/client";
import prettyBytes from "pretty-bytes";
import React from "react";

import DownloadButtons from "./download-buttons";
import FileCard from "./file-card";
import ShareButtons from "./share-buttons";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const { data: folder } = await http.get<{ files: File[] } & Folder>(
    `/api/folders/${slug}`,
  );

  const totalSize = () => {
    if (!folder.files) return 0;

    const bytes = Array.from(folder.files).reduce(
      (acc, file) => acc + file.size,
      0,
    );

    return bytes;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosyalar</CardTitle>
        <CardDescription className="flex flex-wrap gap-3">
          <span>Toplam boyut: {prettyBytes(totalSize())}</span>
          <span>
            Oluşturulma tarihi: {new Date(folder.createdAt).toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {folder.files.map((file: File) => (
            <FileCard file={file} key={file.id} />
          ))}
        </ul>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ShareButtons folder={folder} />
        <DownloadButtons folder={folder} />
      </CardFooter>
    </Card>
  );
}
