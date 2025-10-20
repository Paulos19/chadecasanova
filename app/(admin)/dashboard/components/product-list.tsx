// app/(admin)/dashboard/components/product-list.tsx
"use client";

import Image from "next/image";
import { Product } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "./product-actions"; // Nosso componente

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">Nenhum produto cadastrado</h3>
        <p className="text-sm text-muted-foreground">
          Comece adicionando um novo produto à sua lista.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status (Recebido / Desejado)</TableHead>
            <TableHead className="w-[50px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isSoldOut =
              product.currentQuantity >= product.desiredQuantity;
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={`/api/images/${product.imageUrl}`}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {product.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>
                      {product.currentQuantity} / {product.desiredQuantity}
                    </span>
                    {isSoldOut && (
                      <Badge variant="destructive">Esgotado</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ProductActions
                    productId={product.id}
                    productName={product.name}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}