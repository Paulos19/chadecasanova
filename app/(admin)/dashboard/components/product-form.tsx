// app/(admin)/dashboard/components/product-form.tsx (Corrigido)
"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { productSchema } from "@/lib/schemas";
import { createProduct } from "@/actions/product";
import { toast } from "sonner";
import Image from "next/image";

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

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema) as Resolver<z.infer<typeof productSchema>>,
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "", // (Isso agora será a 'key')
      desiredQuantity: 1,
    },
  });

  const imageKey = form.watch("imageUrl");

  // Função para lidar com o Upload da Imagem
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

    // --- CORREÇÃO ESTÁ AQUI ---
    // 1. Criar FormData e anexar o arquivo
    const formData = new FormData();
    formData.append("file", file); // A chave "file" deve bater com a API

    // Gerar preview local
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Limpar preview antigo
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // 2. Enviar o FormData no body.
      // O browser definirá o Content-Type como 'multipart/form-data'
      // 3. Remover o "?filename=" da URL.
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      // --- FIM DA CORREÇÃO ---

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
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  }

  // Função para lidar com o Submit do Formulário
  async function onSubmit(
    values: z.infer<typeof productSchema>
  ) {
    startTransition(async () => {
      const result = await createProduct(values);

      if (result.success) {
        toast.success(result.message);
        form.reset();
        setPreviewUrl(null);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Adicionar Novo Produto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Adicione um item à sua lista de desejos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Campo Nome */}
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

            {/* Campo Descrição */}
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

            {/* Campo Quantidade */}
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

            {/* Campo Imagem */}
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
                    {(previewUrl || imageKey) && (
                      <div className="mt-2 rounded-md border p-2">
                        <Image
                          src={
                            previewUrl || // Prioriza o preview local
                            `/api/images/${imageKey}` // Fallback para a API
                          }
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
                {isPending ? "Salvando..." : "Salvar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}