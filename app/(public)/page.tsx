// app/(public)/page.tsx
import prisma from "@/lib/prisma";
import { ProductGrid } from "./components/product-grid";
import { SearchInput } from "./components/search-input";
import { Prisma } from "@prisma/client";
// 1. Importar authOptions e getServerSession
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts(searchQuery: string | undefined) {
  const where: Prisma.ProductWhereInput = {};

  if (searchQuery) {
    where.name = {
      contains: searchQuery,
      mode: "insensitive",
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: where,
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

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const searchQuery = searchParams?.search;
  const products = await getProducts(searchQuery);

  // 2. Buscar a sessão e os presentes do usuário logado
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let giftedProductIds = new Set<string>();

  if (userId) {
    const userGifts = await prisma.gift.findMany({
      where: { userId: userId },
      select: { productId: true },
    });
    giftedProductIds = new Set(userGifts.map((gift) => gift.productId));
  }

  // 3. Mapear os produtos para incluir o status 'userHasGifted'
  const productsWithGiftStatus = products.map((product) => ({
    ...product,
    userHasGifted: giftedProductIds.has(product.id),
  }));

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

      <SearchInput />

      {/* 4. Passar a lista de produtos atualizada para o grid */}
      <ProductGrid products={productsWithGiftStatus} />
    </div>
  );
}