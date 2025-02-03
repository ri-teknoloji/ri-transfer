"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { File } from "@prisma/client";
import {
  LucideCopy,
  LucideDownload,
  LucideEye,
  LucideFile,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import React from "react";
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
        "grid grid-cols-1 gap-3 md:grid-cols-2",
        "rounded-md border p-3 shadow-md",
      )}
    >
      <div className="flex gap-3">
        <LucideFile />
        <strong className="truncate">{fileName}</strong>
        <small className="text-nowrap">{prettyBytes(file.size)}</small>
      </div>
      <div className="flex justify-end gap-3">
        <Button onClick={handleDownload} size={"icon"} variant={"ghost"}>
          <LucideDownload />
        </Button>
        <Button onClick={handleCopy} size={"icon"} variant={"ghost"}>
          <LucideCopy />
        </Button>
        <Button onClick={handlePreview} size={"icon"} variant={"ghost"}>
          <LucideEye />
        </Button>
      </div>
    </li>
  );
}
