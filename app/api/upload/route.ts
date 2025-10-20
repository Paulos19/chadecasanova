// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "Nome do arquivo não encontrado." },
      { status: 400 }
    );
  }

  try {
    // O 'request.body' é o stream do arquivo
    const blob = await put(filename, request.body, {
      access: "public",
    });

    // Retorna a URL pública do blob
    return NextResponse.json(blob);
  } catch (error) {
    console.error("[BLOB_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem." },
      { status: 500 }
    );
  }
}