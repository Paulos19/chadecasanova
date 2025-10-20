// app/(public)/layout.tsx
import { ReactNode } from "react";

// (Aqui podemos adicionar um Header público com botão de Logout no futuro)
// import { PublicHeader } from "./components/public-header";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <PublicHeader /> */}
      <main className="flex-1 bg-gray-50/50">
        {children}
      </main>
      {/* <PublicFooter /> */}
    </div>
  );
}