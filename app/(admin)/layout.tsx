// app/(admin)/layout.tsx
import { ReactNode } from "react";
// (No futuro, podemos adicionar um Header ou Sidebar de Admin aqui)

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Ex: <AdminHeader /> */}
      <main className="flex-1 p-8">
        {/* Este 'children' serão as páginas do admin */}
        {children}
      </main>
    </div>
  );
}