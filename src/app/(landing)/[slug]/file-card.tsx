"use client";

import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import {
  LucideCopy,
  LucideDownload,
  LucideEye,
  LucideFile,
} from "lucide-react";
import React from "react";
import prettyBytes from "pretty-bytes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileCardProps {
  file: File;
}

export default function FileCard({ file }: FileCardProps) {
  const fileName = file.name.split("_").slice(1).join("_");

  const fileUrl = location.origin + "/uploads/" + file.name;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fileUrl);
    toast.success("Link kopyalandı");
  };

  const handlePreview = () => {
    window.open(fileUrl, "_blank");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <li
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-3",
        "p-3 rounded-md shadow-md border"
      )}
    >
      <div className="flex gap-3">
        <LucideFile />
        <strong className="truncate">{fileName}</strong>
        <small className="text-nowrap">{prettyBytes(file.size)}</small>
      </div>
      <div className="flex gap-3 justify-end">
        <Button size={"icon"} variant={"ghost"} onClick={handleDownload}>
          <LucideDownload />
        </Button>
        <Button size={"icon"} variant={"ghost"} onClick={handleCopy}>
          <LucideCopy />
        </Button>
        <Button size={"icon"} variant={"ghost"} onClick={handlePreview}>
          <LucideEye />
        </Button>
      </div>
    </li>
  );
}
