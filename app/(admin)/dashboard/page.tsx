// app/(admin)/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { ProductForm } from "./components/product-form";
import { ProductList } from "./components/product-list";
import { Button } from "@/components/ui/button";

// Forçar dinâmico aqui também para garantir dados frescos no admin
export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      // INCLUIR QUEM PRESENTEOU
      include: {
        gifts: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
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
        {/* Adicionado text-white */}
        <h1 className="text-3xl font-bold text-white">
          Meus Produtos
        </h1>
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