// app/(admin)/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { ProductForm } from "./components/product-form";
import { ProductList } from "./components/product-list";

// Função para buscar os dados no servidor
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

// A página agora é um Server Component (async)
export default async function DashboardPage() {
  // 1. Buscar os produtos no servidor
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Meus Produtos
        </h1>
        {/* O formulário de "Adicionar" continua aqui */}
        <ProductForm />
      </div>

      {/* 2. Passar os produtos para o componente de lista */}
      <ProductList products={products} />
    </div>
  );
}