// actions/product.ts
"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getNetlifyStore } from "@/lib/blob-store";

// Definimos o tipo de retorno para dar feedback ao formulário
type FormState = {
  success: boolean;
  message: string;
};

export async function createProduct(
  values: z.infer<typeof productSchema>
): Promise<FormState> {
  // 1. Validar os dados no servidor (segurança)
  const validatedFields = productSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Erro de validação. Verifique os campos.",
    };
  }

  const { name, description, imageUrl, desiredQuantity } =
    validatedFields.data;

  try {
    // 2. Criar o produto no banco
    await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        desiredQuantity,
        // currentQuantity é 0 por padrão (definido no schema.prisma)
      },
    });

    // 3. Revalidar o cache
    // Limpa o cache da homepage e do dashboard para que vejam o novo produto
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Produto adicionado com sucesso!",
    };
  } catch (error) {
    console.error("[PRODUCT_CREATE_ACTION_ERROR]", error);
    return {
      success: false,
      message: "Erro no servidor. Não foi possível criar o produto.",
    };
  }
}

export async function deleteProduct(
  productId: string
): Promise<FormState> {
  // 1. Verificar se é o Admin
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return {
      success: false,
      message: "Acesso negado.",
    };
  }

  try {
    // 2. Buscar o produto para pegar a key da imagem
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    // 3. Deletar o produto do banco de dados
    // (O Prisma 'onDelete: Cascade' cuidará dos 'Gifts' associados)
    await prisma.product.delete({
      where: { id: productId },
    });

    // 4. Deletar a imagem do Netlify Blob
    try {
      const store = getNetlifyStore("images");
      await store.delete(product.imageUrl);
    } catch (blobError) {
      // Logar o erro, mas não parar a execução
      // O produto já foi deletado do DB, que é o mais importante.
      console.warn(
        `[BLOB_DELETE_WARN] Falha ao deletar imagem do blob: ${product.imageUrl}`,
        blobError
      );
    }

    // 5. Revalidar o cache
    revalidatePath("/dashboard");
    revalidatePath("/"); // Homepage (para o item sumir de lá)

    return {
      success: true,
      message: "Produto excluído com sucesso!",
    };
  } catch (error) {
    console.error("[PRODUCT_DELETE_ACTION_ERROR]", error);
    return {
      success: false,
      message: "Erro ao excluir o produto.",
    };
  }
}