// app/(public)/components/product-card.tsx
"use client";

import Image from "next/image";
import { Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// 1. Importar a nova action 'cancelGift'
import { giftProduct, cancelGift } from "@/actions/gift";
import { useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
// 2. Importar o ícone 'Undo'
import { Gift, Check, Undo } from "lucide-react";

type ProductCardProps = {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "description"
    | "imageUrl"
    | "desiredQuantity"
    | "currentQuantity"
  > & {
    // 3. Receber a nova propriedade
    userHasGifted: boolean;
  };
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

  // 4. Renomear para clareza, pois agora lida com ambos
  const handleGiftAction = async () => {
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

  // 5. Nova função para o cancelamento
  const handleCancelAction = async () => {
    startTransition(async () => {
      toast.info("Cancelando seu presente...");
      const result = await cancelGift(product.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  // 6. Determinar o estado do botão
  const { userHasGifted } = product;

  // O botão fica desabilitado se estiver esgotado E o usuário não o tiver presenteado,
  // OU se uma ação estiver pendente.
  const isDisabled = (isSoldOut && !userHasGifted) || isPending;
  
  // Determinar qual variante usar
  const getButtonVariant = () => {
    if (userHasGifted) return "destructive"; // Vermelho para cancelar
    if (isSoldOut) return "secondary"; // Cinza para esgotado
    return "default"; // Padrão para presentear
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
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
        {isSoldOut && !userHasGifted && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3"
          >
            Esgotado!
          </Badge>
        )}
        {/* Badge para quando O USUÁRIO presenteou */}
        {userHasGifted && (
          <Badge
            variant="default" // Pode ser 'outline' ou 'default'
            className="absolute right-3 top-3 bg-green-600 text-white"
          >
            Você presenteou!
          </Badge>
        )}
      </div>

      {/* 2. Conteúdo (Progresso com cor branca) */}
      <div className="flex flex-1 flex-col p-5 text-white">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-300">
          {product.description ||
            "Um presente especial para nossa casa nova."}
        </p>

        <div className="mt-4 w-full space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-200">
            <span>Recebido:</span>
            <span>
              {product.currentQuantity} / {product.desiredQuantity}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-white/20 [&>div]:bg-white"
          />
        </div>
      </div>

      {/* 3. Footer com Botão (Lógica atualizada) */}
      <div className="p-5 pt-0">
        <Button
          onClick={userHasGifted ? handleCancelAction : handleGiftAction}
          disabled={isDisabled}
          className="w-full font-bold"
          variant={getButtonVariant()}
          size="lg"
        >
          {/* Lógica de ícone e texto do botão */}
          {userHasGifted ? (
            <>
              <Undo className="mr-2 h-4 w-4" />
              {isPending ? "Cancelando..." : "Cancelar Presente"}
            </>
          ) : isSoldOut ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Obrigado!
            </>
          ) : (
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