// app/(public)/page.tsx
import prisma from "@/lib/prisma";
import { ProductGrid } from "./components/product-grid"; // Importe o novo grid

// Esta função de busca (Server-Side) continua a mesma
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
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

// A página continua sendo um Server Component, o que é ótimo!
export default async function HomePage() {
  const products = await getProducts();

  return (
    // O 'isolate' é do layout, garantindo que o z-index funcione
    <div className="isolate container mx-auto max-w-7xl p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-white">
          Nosso Chá de Casa Nova
        </h1>
        <p className="mt-2 text-xl text-gray-300">
          Escolha um item da lista para nos presentear!
        </p>
      </header>

      {/* Passamos os dados do servidor para o componente cliente
        'ProductGrid', que cuidará da animação.
      */}
      <ProductGrid products={products} />
    </div>
  );
}