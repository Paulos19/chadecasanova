// app/(admin)/dashboard/components/product-actions.tsx
"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/product";
import { Product } from "@prisma/client"; // 1. Importar o tipo Product
import { ProductForm } from "./product-form"; // 2. Importar o formulário

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// 3. Receber o objeto 'product' completo
type ProductActionsProps = {
  product: Product;
};

export function ProductActions({ product }: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      toast.loading("Excluindo produto...");
      const result = await deleteProduct(product.id); // Usar product.id

      if (result.success) {
        toast.success(result.message);
        setIsAlertOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          {/* 4. O <ProductForm> agora envolve o item "Editar" */}
          <ProductForm
            productToEdit={product}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()} // Impede o dropdown de fechar ao clicar
              >
                Editar
              </DropdownMenuItem>
            }
          />

          {/* O "Excluir" continua o mesmo */}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conteúdo do Modal de Confirmação (Excluir) */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso excluirá permanentemente o produto:
            <strong className="block py-2">
              {product.name}
            </strong>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Excluindo..." : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}