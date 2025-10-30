// app/(public)/components/product-grid.tsx
"use client";

import { motion } from "framer-motion";
import { Product } from "@prisma/client";
import { ProductCard } from "./product-card";

// (O tipo dos dados do produto)
// Adicionado 'userHasGifted' para saber se o usuário logado presenteou este item
type ProductData = Pick<
  Product,
  | "id"
  | "name"
  | "description"
  | "imageUrl"
  | "desiredQuantity"
  | "currentQuantity"
> & {
  userHasGifted: boolean;
};

type ProductGridProps = {
  products: ProductData[];
};

// Variantes para a animação do container (grid)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Anima cada filho com 0.1s de atraso
    },
  },
};

// Variantes para a animação de cada item (card)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-300">
        {/* Mensagem atualizada para refletir a busca */}
        Nenhum presente encontrado. Tente uma busca diferente.
      </p>
    );
  }

  return (
    // O 'motion.div' controla a animação "stagger"
    <motion.div
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        // Passamos as 'itemVariants' para o ProductCard
        <ProductCard
          key={product.id}
          product={product}
          variants={itemVariants}
        />
      ))}
    </motion.div>
  );
}