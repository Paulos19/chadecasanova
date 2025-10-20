// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"; // Importar JWT
import { Role } from "@prisma/client";

declare module "next-auth" {
  /**
   * Extenda a interface Session
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  /**
   * Extenda a interface User (do DB)
   */
  interface User {
    role: Role;
  }
}

// Declarar os tipos para o token JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}