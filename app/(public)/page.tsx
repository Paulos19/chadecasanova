// app/(public)/page.tsx
import prisma from "@/lib/prisma";
import { ProductGrid } from "./components/product-grid";
// 1. Importar o novo componente de busca
import { SearchInput } from "./components/search-input";
// 2. Importar tipos do Prisma para a cláusula 'where'
import { Prisma } from "@prisma/client";

// Manter a página dinâmica para revalidação
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 3. Atualizar getProducts para aceitar a query de busca
async function getProducts(searchQuery: string | undefined) {
  
  // 4. Criar a cláusula 'where' dinâmica
  const where: Prisma.ProductWhereInput = {};

  if (searchQuery) {
    where.name = {
      contains: searchQuery, // Filtra pelo nome
      mode: "insensitive",  // Ignora maiúsculas/minúsculas
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: where, // 5. Aplicar o filtro na query
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        desiredQuantity: true,
        currentQuantity: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("[GET_PRODUCTS_ERROR]", error);
    return [];
  }
}

// 6. Receber searchParams na props da página
export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  // 7. Obter a query da URL
  const searchQuery = searchParams?.search;
  
  // 8. Passar a query para a função de busca
  const products = await getProducts(searchQuery);

  return (
    <div className="isolate container mx-auto max-w-7xl p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-white">
          Nosso Chá de Casa Nova
        </h1>
        <p className="mt-2 text-xl text-gray-300">
          Escolha um item da lista para nos presentear!
        </p>
      </header>

      {/* 9. Adicionar o componente de busca à página */}
      <SearchInput />

      {/* ProductGrid agora receberá a lista filtrada (ou completa se não houver busca) */}
      <ProductGrid products={products} />
    </div>
  );
}