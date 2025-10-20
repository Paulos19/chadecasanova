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

// O tipo de retorno continua o mesmo
type FormState = {
  success: boolean;
  message: string;
};

// --- FUNÇÃO DE CRIAÇÃO (Sem alterações) ---
export async function createProduct(
  values: z.infer<typeof productSchema>
): Promise<FormState> {
  // 1. Validar os dados no servidor
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
      },
    });

    // 3. Revalidar o cache
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

// --- FUNÇÃO DE ATUALIZAÇÃO (NOVA) ---
export async function updateProduct(
  productId: string,
  values: z.infer<typeof productSchema>
): Promise<FormState> {
  // 1. Verificar se é o Admin
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return {
      success: false,
      message: "Acesso negado.",
    };
  }

  // 2. Validar os dados
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
    // 3. Buscar o produto antigo para pegar a key da imagem
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    if (!oldProduct) {
      throw new Error("Produto não encontrado.");
    }

    // 4. Atualizar o produto no banco
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        imageUrl, // imageUrl é a nova key (ou a antiga se não mudou)
        desiredQuantity,
      },
    });

    // 5. Limpeza do Blob: Se a imagem mudou, delete a antiga
    if (oldProduct.imageUrl !== imageUrl) {
      try {
        const store = getNetlifyStore("images");
        await store.delete(oldProduct.imageUrl);
      } catch (blobError) {
        console.warn(
          `[BLOB_DELETE_WARN] Falha ao deletar imagem antiga: ${oldProduct.imageUrl}`,
          blobError
        );
      }
    }

    // 6. Revalidar o cache
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Produto atualizado com sucesso!",
    };
  } catch (error) {
    console.error("[PRODUCT_UPDATE_ACTION_ERROR]", error);
    return {
      success: false,
      message: "Erro no servidor. Não foi possível atualizar o produto.",
    };
  }
}

// --- FUNÇÃO DE EXCLUSÃO (Sem alterações) ---
export async function deleteProduct(
  productId: string
): Promise<FormState> {
  // ... (código existente da função deleteProduct)
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return {
      success: false,
      message: "Acesso negado.",
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    try {
      const store = getNetlifyStore("images");
      await store.delete(product.imageUrl);
    } catch (blobError) {
      console.warn(
        `[BLOB_DELETE_WARN] Falha ao deletar imagem do blob: ${product.imageUrl}`,
        blobError
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

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