// lib/schemas.ts
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url({ message: "URL da imagem é obrigatória." }),
  desiredQuantity: z.coerce // 'coerce' converte o string do form para número
    .number()
    .int()
    .positive({ message: "Quantidade deve ser maior que zero." }),
});