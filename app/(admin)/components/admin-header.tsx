// app/(admin)/components/admin-header.tsx
import { UserNav } from "@/components/ser-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between p-8">
        {/* Lado esquerdo: Link para ver o site */}
        <nav>
          <Button asChild variant="link">
            <Link href="/">
              Ver Site
            </Link>
          </Button>
        </nav>

        {/* Lado direito: Menu do Usuário */}
        <UserNav />
      </div>
    </header>
  );
}