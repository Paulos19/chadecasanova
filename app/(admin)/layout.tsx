// app/(admin)/layout.tsx
import { ReactNode } from "react";
import { AdminHeader } from "./components/admin-header"; // 1. Importar

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader /> {/* 2. Adicionar o header */}
      <main className="flex-1 p-8">
        {/* Container para limitar o conteúdo do dashboard */}
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}