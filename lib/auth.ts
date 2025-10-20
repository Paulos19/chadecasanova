// lib/auth.ts (Atualizado para Estratégia JWT)

import { AuthOptions } from "next-auth";
// REMOVIDO: PrismaAdapter e Adapter
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export const authOptions: AuthOptions = {
  // REMOVIDO: O adapter não é usado com estratégia JWT
  // adapter: PrismaAdapter(prisma) as Adapter, 
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // A função authorize continua igual, buscando no Prisma
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Credenciais inválidas");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Credenciais inválidas");
        }

        // Retorna o usuário do DB para o callback JWT
        return user;
      },
    }),
  ],

  // MUDANÇA PRINCIPAL: Usar estratégia JWT
  session: {
    strategy: "jwt",
  },

  // Callbacks atualizados para JWT
  callbacks: {
    /**
     * O callback 'jwt' é chamado primeiro.
     * O 'user' só está disponível no login inicial.
     * Nós pegamos os dados do 'user' (do DB) e os colocamos no 'token'.
     */
    async jwt({ token, user }) {
      if (user) {
        // No login, 'user' é o objeto que retornamos do 'authorize'
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    
    /**
     * O callback 'session' é chamado depois.
     * Ele pega os dados do 'token' (que definimos acima) 
     * e os envia para o cliente (para o useSession()).
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};