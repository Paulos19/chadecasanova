// app/(admin)/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { ProductForm } from "./components/product-form";
import { ProductList } from "./components/product-list";
import { Button } from "@/components/ui/button"; // Importar Button

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("[GET_PRODUCTS_DASHBOARD_ERROR]", error);
    return [];
  }
}

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Meus Produtos
        </h1>
        {/* --- MUDANÇA AQUI ---
          Passamos o botão "Adicionar" como a 'trigger'
          para o ProductForm em modo de 'criação'.
        */}
        <ProductForm
          trigger={
            <Button>Adicionar Novo Produto</Button>
          }
        />
      </div>

      <ProductList products={products} />
    </div>
  );
}