// app/(admin)/components/admin-header.tsx
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo"; // 1. Importar o Logo

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      {/* 2. Ajustar o padding e max-width */}
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Lado esquerdo: Logo */}
        {/* 3. Precisamos "forçar" o texto do logo para escuro aqui */}
        <div className="[&_span]:text-foreground [&_svg]:text-foreground">
          <Logo />
        </div>

        {/* Lado direito: Links e UserNav */}
        <div className="flex items-center gap-4">
          <Button asChild variant="link" className="hidden sm:block">
            <Link href="/">
              Ver Site
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}