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

export default async function DashboardPage() {
  const products = await getProducts();

  // O container e o padding agora estão no layout,
  // então só precisamos do 'space-y-6'
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Meus Produtos
        </h1>
        <ProductForm />
      </div>

      <ProductList products={products} />
    </div>
  );
}