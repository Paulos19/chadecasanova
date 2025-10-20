// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Email e senha são obrigatórios", {
        status: 400,
      });
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Email já cadastrado", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // LÓGICA DO ADMIN
    const userRole =
      email === process.env.ADMIN_EMAIL ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: userRole,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[REGISTER_POST_ERROR]", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}