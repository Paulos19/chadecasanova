// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` anexa o token do usuário à requisição.
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const { token } = request.nextauth;
    const { role } = token || {};

    // 1. Proteger o Dashboard do Admin
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api/admin") // (Se criarmos APIs de admin)
    ) {
      // Se não for ADMIN, redireciona para a homepage
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // (Não precisamos proteger a homepage '/' aqui, pois
    // o 'matcher' abaixo já faz isso por padrão)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // !!token (double bang) converte para booleano
        // Se o token existir (usuário logado), ele está autorizado.
        return !!token;
      },
    },
    // Página de login (para onde será redirecionado se 'authorized' falhar)
    pages: {
      signIn: "/login",
    },
  }
);

// O 'matcher' define QUAIS rotas serão protegidas pelo middleware
export const config = {
  matcher: [
    /*
     * Combinar todas as rotas, exceto as que não precisam de auth:
     * - /login, /register (páginas de auth)
     * - /api/auth/** (rotas do Next-Auth)
     * - /api/register (nossa API de registro)
     * - arquivos estáticos (_next/static, _next/image, favicon.ico)
     */
    "/", // A homepage (lista de presentes)
    "/dashboard/:path*", // Todas as rotas do admin
  ],
};