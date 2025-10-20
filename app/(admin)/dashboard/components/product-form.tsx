// app/(admin)/dashboard/components/product-form.tsx
"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { productSchema } from "@/lib/schemas";
import { createProduct, updateProduct } from "@/actions/product"; // Importar updateProduct
import { toast } from "sonner";
import Image from "next/image";
import { Product } from "@prisma/client"; // Importar o tipo Product

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- NOVAS PROPS ---
type ProductFormProps = {
  productToEdit?: Product; // O produto para editar (opcional)
  trigger: React.ReactNode; // O botão que abre o modal (obrigatório)
};

export function ProductForm({
  productToEdit,
  trigger,
}: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- LÓGICA DE EDIÇÃO ---
  const isEditMode = !!productToEdit;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    // Define os valores padrão (se for edição, usa o produto, senão, vazio)
    defaultValues: isEditMode
      ? {
          name: productToEdit.name,
          description: productToEdit.description || "",
          imageUrl: productToEdit.imageUrl,
          desiredQuantity: productToEdit.desiredQuantity,
        }
      : {
          name: "",
          description: "",
          imageUrl: "",
          desiredQuantity: 1,
        },
  });

  // Função para pré-preencher a imagem ao abrir o modal de edição
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Resetar ao fechar
      form.reset(isEditMode ? productToEdit : { name: "", description: "", imageUrl: "", desiredQuantity: 1 });
      setPreviewUrl(null);
    } else if (isEditMode) {
      // Definir o preview da imagem existente ao abrir
      setPreviewUrl(`/api/images/${productToEdit.imageUrl}`);
    }
  };

  // Upload de imagem (sem alterações, esta lógica funciona)
  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    const file = event.target.files?.[0];

    if (!file) {
      return toast.error("Nenhum arquivo selecionado.");
    }

    setIsUploading(true);
    toast.loading("Enviando imagem...");
    
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Limpar preview antigo
    setPreviewUrl(URL.createObjectURL(file)); // Preview local

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload");
      }

      const newBlob = (await response.json()) as { key: string };

      form.setValue("imageUrl", newBlob.key, {
        shouldValidate: true,
      });
      toast.dismiss();
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao enviar imagem.");
      // Se falhar, reverte para a imagem original (se houver)
      setPreviewUrl(
        isEditMode ? `/api/images/${productToEdit.imageUrl}` : null
      );
    } finally {
      setIsUploading(false);
    }
  }

  // Função de Submit (agora condicional)
  async function onSubmit(
    values: z.infer<typeof productSchema>
  ) {
    startTransition(async () => {
      let result: FormState;

      if (isEditMode) {
        // --- MODO DE EDIÇÃO ---
        result = await updateProduct(productToEdit.id, values);
      } else {
        // --- MODO DE CRIAÇÃO ---
        result = await createProduct(values);
      }

      // Feedback
      if (result.success) {
        toast.success(result.message);
        handleOpenChange(false); // Fecha e reseta o modal
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    // O Dialog agora usa o 'onOpenChange' customizado
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Faça alterações no item da sua lista."
              : "Adicione um item à sua lista de desejos."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* ... (Campos Nome, Descrição, Quantidade - sem mudanças) ... */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Jogo de panelas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes do produto, cor, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desiredQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Desejada</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Imagem (Lógica de preview atualizada) */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormDescription>
                    {isUploading && "Enviando..."}
                    {/* Se tiver previewUrl, use-o.
                        (Ele será setado com a img local no upload,
                         ou com a img do BD ao abrir o modal)
                    */}
                    {previewUrl && (
                      <div className="mt-2 rounded-md border p-2">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending || isUploading}
              >
                {isPending
                  ? "Salvando..."
                  : isEditMode
                  ? "Salvar Alterações"
                  : "Salvar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}