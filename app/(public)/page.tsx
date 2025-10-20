// app/(public)/page.tsx
import prisma from "@/lib/prisma";
import { ProductCard } from "./components/product-card";

// Função para buscar os dados no servidor
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      // Selecionar apenas os campos que o Card precisa
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        desiredQuantity: true,
        currentQuantity: true,
      },
      orderBy: {
        createdAt: "desc", // Mais novos primeiro
      },
    });
    return products;
  } catch (error) {
    console.error("[GET_PRODUCTS_ERROR]", error);
    return []; // Retorna array vazio em caso de erro
  }
}

// Este é um Server Component (por ser 'async')
export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">
          Nosso Chá de Casa Nova
        </h1>
        <p className="text-lg text-muted-foreground">
          Escolha um item da lista para nos presentear!
        </p>
      </header>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          A lista de presentes ainda não foi adicionada pelo administrador.
        </p>
      ) : (
        // Grid responsivo para os cards
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}