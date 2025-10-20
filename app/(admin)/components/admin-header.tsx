// app/(admin)/components/admin-header.tsx
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo"; // Importar o Logo

export function AdminHeader() {
  return (
    // 1. MUDANÇA: Trocar 'bg-background' por um fundo escuro fixo
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* 2. MUDANÇA: Remover o 'div' que forçava a cor */}
        {/* O Logo agora usará seu 'text-white' padrão */}
        <Logo />

        {/* Lado direito: Links e UserNav */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="link"
            // 3. MUDANÇA: Adicionar 'text-white' para o link
            className="hidden text-white sm:block"
          >
            <Link href="/">
              Ver Site
            </Link>
          </Button>
          {/* O UserNav já funciona em fundos escuros */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}