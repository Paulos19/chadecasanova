// app/(public)/components/product-card.tsx
"use client";

import Image from "next/image";
import { Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransition } from "react";
import { toast } from "sonner";
import { giftProduct } from "@/actions/gift";

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
};

export function ProductCard({ product }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();

  const isSoldOut =
    product.currentQuantity >= product.desiredQuantity;
  const progressPercentage =
    (product.currentQuantity / product.desiredQuantity) * 100;

  // Função que chamará a Server Action
  const handleGift = async () => {
    startTransition(async () => {
      toast.info("Processando seu presente...");

      // (MUDANÇA): Chamar a Server Action real
      const result = await giftProduct(product.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative h-48 w-full overflow-hidden rounded-md">
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
              className="absolute right-2 top-2"
            >
              Esgotado!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>
          {product.description ||
            "O administrador não adicionou uma descrição."}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="w-full space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Recebido: {product.currentQuantity} de{" "}
            {product.desiredQuantity}
          </p>
          <Progress value={progressPercentage} />
        </div>

        <Button
          onClick={handleGift}
          disabled={isSoldOut || isPending}
          className="w-full"
        >
          {isSoldOut
            ? "Presente Esgotado"
            : isPending
            ? "Processando..."
            : "Presentear com 1 unidade"}
        </Button>
      </CardFooter>
    </Card>
  );
}