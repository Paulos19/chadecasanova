// app/(public)/components/product-card.tsx
"use client";

import Image from "next/image";
import { Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { giftProduct } from "@/actions/gift";
import { useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";

type ProductCardProps = {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "description"
    | "imageUrl"
    | "desiredQuantity"
    | "currentQuantity"
  >;
  // Adicionado para a animação da grade
  variants?: any;
};

export function ProductCard({
  product,
  variants,
}: ProductCardProps) {
  const [isPending, startTransition] = useTransition();

  const isSoldOut =
    product.currentQuantity >= product.desiredQuantity;
  const progressPercentage =
    (product.currentQuantity / product.desiredQuantity) * 100;

  const handleGift = async () => {
    startTransition(async () => {
      toast.info("Processando seu presente...");
      const result = await giftProduct(product.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    // O Card principal agora é um 'motion.div'
    <motion.div
      variants={variants} // Para a animação da grade
      whileHover={{ y: -5, scale: 1.02 }} // Animação de hover
      transition={{ type: "spring", stiffness: 300 }}
      // --- Estilo Glassmorphism ---
      className="flex flex-col overflow-hidden rounded-xl border
                 border-white/10 bg-black/30 backdrop-blur-lg shadow-xl"
    >
      {/* 1. Imagem */}
      <div className="relative h-56 w-full">
        <Image
          src={`/api/images/${product.imageUrl}`}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isSoldOut && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3"
          >
            Esgotado!
          </Badge>
        )}
      </div>

      {/* 2. Conteúdo (Nome, Descrição, Progresso) */}
      <div className="flex flex-1 flex-col p-5 text-white">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-300">
          {product.description ||
            "Um presente especial para nossa casa nova."}
        </p>

        {/* Progresso */}
        <div className="mt-4 w-full space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-200">
            <span>Recebido:</span>
            <span>
              {product.currentQuantity} / {product.desiredQuantity}
            </span>
          </div>
          {/* ATUALIZAÇÃO: Barra de progresso com fundo (trilho) e indicador brancos */}
          <Progress
            value={progressPercentage}
            className="h-2 bg-white/20 [&>div]:bg-white"
          />
        </div>
      </div>

      {/* 3. Footer com Botão */}
      <div className="p-5 pt-0">
        <Button
          onClick={handleGift}
          disabled={isSoldOut || isPending}
          className="w-full font-bold"
          variant={isSoldOut ? "secondary" : "default"}
          size="lg"
        >
          {isSoldOut ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Obrigado!
            </>
          ) : (
            // Animação no ícone do botão
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              <Gift className="mr-2 h-4 w-4" />
              {isPending
                ? "Processando..."
                : "Presentear com 1 unidade"}
            </motion.div>
          )}
        </Button>
      </div>
    </motion.div>
  );
}