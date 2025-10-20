// app/(admin)/dashboard/components/product-actions.tsx
"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/product";

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

type ProductActionsProps = {
  productId: string;
  productName: string;
};

export function ProductActions({
  productId,
  productName,
}: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  // Estado para controlar o modal de exclusão (evita fechar)
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      toast.loading("Excluindo produto...");
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success(result.message);
        setIsAlertOpen(false); // Fecha o modal
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    // O AlertDialog controla o modal de confirmação
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
          <DropdownMenuItem onClick={() => toast.info("Edição em breve!")}>
            Editar
          </DropdownMenuItem>
          {/* O AlertDialogTrigger abre o modal de confirmação */}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()} // Impede o dropdown de fechar
            >
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conteúdo do Modal de Confirmação */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso excluirá permanentemente o produto:
            <strong className="block py-2">
              {productName}
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