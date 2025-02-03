"use client";

import { Button } from "@/components/ui/button";
import { File, Folder } from "@prisma/client";
import { LucideCopy, LucideMail, LucideQrCode } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  folder: { files: File[] } & Folder;
}

export default function ShareButtons({ folder }: ShareButtonsProps) {
  const location =
    typeof window !== "undefined" ? window.location : { origin: "" };

  const url = location.origin + "/" + folder.id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast.info("Link kopyalandı");
  };

  const handleMail = () => {
    window.open(
      " mailto:" +
        `?body=Paylaşılan dosyalara erişmek için linke tıklayınız <a href="${url}">${url}</a>` +
        "&subject=Paylaşılan Dosyalar",
      "_blank",
    );

    toast.info("Mail sayfası açıldı");
  };

  const handleQrCode = () => {
    window.open("/qrcode/" + encodeURIComponent(url), "_blank");
    toast.info("QR Kod sayfası açıldı");
  };

  return (
    <>
      <div className="flex flex-wrap gap-1">
        <Button onClick={handleQrCode} variant={"outline"}>
          <LucideQrCode />
          QR Kod
        </Button>
        <Button onClick={handleMail} variant={"outline"}>
          <LucideMail />
          E-posta
        </Button>
        <Button onClick={handleCopy} variant={"outline"}>
          <LucideCopy />
          Pano
        </Button>
      </div>
    </>
  );
}
