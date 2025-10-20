// app/(public)/layout.tsx
import { ReactNode } from "react";
import { BackgroundPattern } from "./components/background-pattern";
import { PublicHeader } from "./components/public-header"; // 1. Importar

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundPattern />
      <PublicHeader /> {/* 2. Adicionar o header */}

      <main className="flex-1 isolate">
        {children}
      </main>
    </div>
  );
}