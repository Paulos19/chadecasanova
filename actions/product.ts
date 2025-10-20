// actions/product.ts
"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

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