// app/(public)/layout.tsx
import { ReactNode } from "react";
import { BackgroundPattern } from "./components/background-pattern";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* O Padrão de Fundo ficará fixo atrás de tudo */}
      <BackgroundPattern />

      {/* O 'isolate' abaixo garante que o z-index do fundo não afete o conteúdo */}
      <main className="flex-1 isolate">
        {children}
      </main>
    </div>
  );
}