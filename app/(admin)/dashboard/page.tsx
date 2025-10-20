// app/(admin)/dashboard/page.tsx
import { ProductForm } from "./components/product-form";

export default async function DashboardPage() {
  // (No futuro, vamos buscar e listar os produtos aqui)
  // const products = await prisma.product.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Painel do Administrador
        </h1>
        {/* O formulário agora é um botão que abre um modal */}
        <ProductForm />
      </div>

      {/* Aqui é onde listaremos os produtos
        <div className="rounded-md border">
          <p>Tabela de Produtos...</p>
        </div>
      */}
    </div>
  );
}