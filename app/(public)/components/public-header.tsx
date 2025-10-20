// app/(public)/components/public-header.tsx
"use client";

import { UserNav } from "@/components/user-nav";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo"; // 1. Importar o Logo

export function PublicHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === Role.ADMIN;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/50 backdrop-blur-lg">
      {/* 2. Ajustar o padding e max-width */}
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Lado esquerdo: Logo */}
        <Logo />

        {/* Lado direito: Link do Admin e UserNav */}
        <div className="flex items-center gap-4 text-white">
          {isAdmin && (
            <Button asChild variant="link" className="text-white hidden sm:block">
              <Link href="/dashboard">
                Painel Admin
              </Link>
            </Button>
          )}
          <UserNav />
        </div>
      </div>
    </header>
  );
}