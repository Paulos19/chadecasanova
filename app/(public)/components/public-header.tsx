// app/(public)/components/public-header.tsx
"use client";

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

export function PublicHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === Role.ADMIN;

  return (
    // Header com efeito de vidro, fixo no topo
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/50 backdrop-blur-lg">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between p-8">
        {/* Lado esquerdo: Link para o Dashboard (se for admin) */}
        <div>
          {isAdmin && (
            <Button asChild variant="link" className="text-white">
              <Link href="/dashboard">
                Painel Admin
              </Link>
            </Button>
          )}
        </div>

        {/* Lado direito: Menu do Usuário */}
        <div className="text-white">
          <UserNav />
        </div>
      </div>
    </header>
  );
}