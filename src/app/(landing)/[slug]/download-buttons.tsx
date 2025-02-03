"use client";

import { Button } from "@/components/ui/button";
import http from "@/lib/http";
import { Folder, File } from "@prisma/client";
import { LucideFolderArchive } from "lucide-react";
import { toast } from "sonner";

interface DownloadOptionsProps {
  folder: Folder & { files: File[] };
}

export default function DownloadButtons({ folder }: DownloadOptionsProps) {
  const handleDownload = async () => {
    const { data } = await http.post<{ path: string }>(
      `/api/folders/${folder.id}/zip`
    );

    const a = document.createElement("a");
    a.href = location.origin + data.path.replace("public", "");
    console.log(a.href);
    a.download = `${folder.id}.zip`;
    a.click();

    toast.success("Zip dosyası indirildi.");
  };

  return (
    <div className="flex gap-3">
      <Button onClick={handleDownload}>
        <LucideFolderArchive />
        Zip olarak indir
      </Button>
    </div>
  );
}
