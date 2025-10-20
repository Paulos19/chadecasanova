// lib/schemas.ts
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  
  // MUDANÇA: 'imageUrl' agora é a 'key' do blob, não uma URL
  imageUrl: z
    .string()
    .min(1, { message: "A imagem é obrigatória." }), 

  desiredQuantity: z.coerce
    .number()
    .int()
    .positive({ message: "Quantidade deve ser maior que zero." }),
});