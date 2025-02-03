"use client";

import { QRCodeCanvas } from "qrcode.react";
import React from "react";

interface QrCodeProps {
  params: Promise<{ data: string }>;
}

export default function QrCode({ params }: QrCodeProps) {
  const { data } = React.use(params);

  return (
    <div className="grid h-screen place-items-center bg-black">
      <QRCodeCanvas
        marginSize={1}
        size={256}
        value={decodeURIComponent(data)}
      />
    </div>
  );
}
