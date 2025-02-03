import { Button } from "@/components/ui/button";
import { LucideUpload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <Navbar />
      <main className="container max-w-5xl flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6 shadow-md">
      <div className="container grid grid-cols-1 gap-3 md:grid-cols-2">
        <Image alt="Logo" height={40} src="/logo.png" width={120} />
        <div className="flex items-center justify-end">
          <p>{new Date().getFullYear()} &copy; RiTransfer</p>
        </div>
      </div>
    </footer>
  );
}

function Navbar() {
  return (
    <nav className="py-4 shadow-md">
      <div className="container grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link className="flex items-center gap-1" href="/">
          <Image alt="Logo" height={40} src="/icon.png" width={40} />
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
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button>Github</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
