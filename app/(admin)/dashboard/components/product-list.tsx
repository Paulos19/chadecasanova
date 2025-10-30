// app/(admin)/dashboard/components/product-list.tsx
"use client";

import Image from "next/image";
import { Product, Gift, User } from "@prisma/client"; // Importar tipos necessários
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "./product-actions";

// Tipo estendido para incluir os gifts e users
type ProductWithGifts = Product & {
  gifts: (Gift & {
    user: Pick<User, "email">;
  })[];
};

type ProductListProps = {
  products: ProductWithGifts[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-white/20 p-8 text-center text-gray-300">
        <h3 className="text-lg font-medium">Nenhum produto cadastrado</h3>
        <p className="text-sm text-gray-400">
          Comece adicionando um novo produto à sua lista.
        </p>
      </div>
    );
  }

  return (
    // Adicionado fundo semitransparente e borda mais sutil
    <div className="rounded-md border border-white/10 bg-black/20 backdrop-blur-sm">
      <Table>
        <TableHeader className="border-white/10">
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300 w-[80px]">Imagem</TableHead>
            <TableHead className="text-gray-300">Nome</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            {/* Nova coluna para quem presenteou */}
            <TableHead className="text-gray-300">Presenteado por</TableHead>
            <TableHead className="text-gray-300 w-[50px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isSoldOut =
              product.currentQuantity >= product.desiredQuantity;
            
            return (
              <TableRow key={product.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                     <Image
                      src={`/api/images/${product.imageUrl}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-white">
                  {product.name}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>
                      {product.currentQuantity} / {product.desiredQuantity}
                    </span>
                    {isSoldOut && (
                      <Badge variant="destructive">Esgotado</Badge>
                    )}
                  </div>
                </TableCell>
                {/* Exibir lista de quem presenteou */}
                <TableCell className="text-gray-300 max-w-[200px]">
                  {product.gifts.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {product.gifts.map((gift) => (
                        <li key={gift.id} className="truncate">
                          {gift.user.email}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {/* Passamos uma classe para o botão dentro de ProductActions ficar branco se necessário, 
                      mas o componente padrão 'ghost' já deve se adaptar bem ou podemos forçar lá. */}
                  <div className="text-white">
                      <ProductActions product={product} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}