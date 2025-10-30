// actions/gift.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Definimos o tipo de retorno para o feedback do Sonner
type FormState = {
  success: boolean;
  message: string;
};

export async function giftProduct(
  productId: string
): Promise<FormState> {
  // 1. Verificar a sessão do usuário no LADO DO SERVIDOR
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Você precisa estar logado para presentear.",
    };
  }

  const userId = session.user.id;

  try {
    // 2. Usar uma transação do Prisma
    // Isso garante que ambas as operações (atualizar e criar)
    // ocorram com sucesso.
    await prisma.$transaction(async (tx) => {
      // 3. Buscar o produto DENTRO da transação (para 'lock')
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Produto não encontrado.");
      }

      // 4. Verificar se o produto está esgotado
      if (
        product.currentQuantity >= product.desiredQuantity
      ) {
        throw new Error(
          "Este item já foi totalmente presenteado."
        );
      }

      // 5. Atualizar a quantidade do produto
      await tx.product.update({
        where: { id: productId },
        data: {
          currentQuantity: {
            increment: 1, // Adiciona +1 à quantidade atual
          },
        },
      });

      // 6. Criar o registro do presente (Gift)
      await tx.gift.create({
        data: {
          userId: userId,
          productId: productId,
        },
      });
    });

    // 7. Revalidar o cache da homepage
    revalidatePath("/");
    // Também é bom revalidar o dashboard, caso o admin esteja olhando
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Presente enviado com sucesso! Muito obrigado!",
    };
  } catch (error) {
    console.error("[GIFT_PRODUCT_ACTION_ERROR]", error);
    // Retorna a mensagem de erro específica (ex: "Esgotado")
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao processar o presente.";
    return {
      success: false,
      message: message,
    };
  }
}

export async function cancelGift(
  productId: string
): Promise<FormState> {
  // 1. Verificar a sessão do usuário
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Você precisa estar logado.",
    };
  }

  const userId = session.user.id;

  try {
    // 2. Usar transação
    await prisma.$transaction(async (tx) => {
      // 3. Encontrar o presente (Gift) específico deste usuário
      const gift = await tx.gift.findFirst({
        where: {
          productId: productId,
          userId: userId,
        },
      });

      if (!gift) {
        throw new Error(
          "Presente não encontrado. Você não pode cancelar este item."
        );
      }

      // 4. Deletar o registro do presente
      await tx.gift.delete({
        where: { id: gift.id },
      });

      // 5. Decrementar a quantidade do produto
      await tx.product.update({
        where: { id: productId },
        data: {
          currentQuantity: {
            decrement: 1, // Remove 1 da quantidade atual
          },
        },
      });
    });

    // 6. Revalidar o cache
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Presente cancelado com sucesso.",
    };
  } catch (error) {
    console.error("[CANCEL_GIFT_ACTION_ERROR]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao cancelar o presente.";
    return {
      success: false,
      message: message,
    };
  }
}