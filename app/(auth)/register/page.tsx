// app/(auth)/register/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"; // Importar o Sonner
import axios from "axios";
import { Role } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>
  ) {
    setIsLoading(true);
    try {
      // 1. Chamar a API de Registro
      const response = await axios.post(
        "/api/register",
        values
      );
      const user = response.data;

      // 2. Fazer Login automático
      const loginResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (loginResult?.error) {
        throw new Error("Erro ao fazer login após o registro.");
      }

      // Usar Sonner para sucesso
      toast.success("Cadastro realizado com sucesso!");

      // 3. Redirecionar
      const targetUrl =
        user.role === Role.ADMIN ? "/dashboard" : "/";
      router.push(targetUrl);
    } catch (error: any) {
      // Usar Sonner para erro
      toast.error(
        error.response?.data ||
          "Ocorreu um erro inesperado."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>
          Crie sua conta para participar da lista.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
            <Button
              variant="link"
              size="sm"
              asChild
              className="font-normal"
            >
              <Link href="/login">
                Já tem uma conta? Faça login
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}