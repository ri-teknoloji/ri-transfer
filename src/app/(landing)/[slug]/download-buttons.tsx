"use client";

import { Button } from "@/components/ui/button";
import http, { getFile } from "@/lib/http";
import { File, Folder } from "@prisma/client";
import { LucideFolderArchive } from "lucide-react";
import { toast } from "sonner";

interface DownloadOptionsProps {
  folder: { files: File[] } & Folder;
}

export default function DownloadButtons({ folder }: DownloadOptionsProps) {
  const handleDownload = async () => {
    const { data } = await http.post<{ path: string }>(
      `/api/folders/${folder.id}/zip`,
    );

    const a = document.createElement("a");
    a.href = getFile(data.path);
    console.log(a.href);
    a.download = `${folder.id}.zip`;
    a.click();

    toast.success("Zip dosyası indirildi.");
  };

  return (
    <div className="flex justify-end gap-3">
      <Button onClick={handleDownload}>
        <LucideFolderArchive />
        Zip olarak indir
      </Button>
    </div>
  );
}
