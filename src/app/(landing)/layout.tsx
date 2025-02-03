import { Button } from "@/components/ui/button";
import { LucideUpload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen gap-10">
      <Navbar />
      <main className="flex-1 container max-w-5xl">{children}</main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="shadow-md py-4">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link className="flex items-center gap-1" href="/">
          <Image src="/icon.png" width={40} height={40} alt="Logo" />
          <span className="text-lg font-bold">RiTransfer</span>
        </Link>
        <div className="flex justify-end gap-3">
          <Link href={"/"}>
            <Button variant="secondary">
              <LucideUpload />
              Yeni Yükleme
            </Button>
          </Link>
          <Link
            href={"https://github.com/ri-teknoloji"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Github</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="shadow-md border-t py-6">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-3">
        <Image src="/logo.png" width={120} height={40} alt="Logo" />
        <div className="flex justify-end items-center">
          <p>{new Date().getFullYear()} &copy; RiTransfer</p>
        </div>
      </div>
    </footer>
  );
}
