// app/api/upload/route.ts
import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Para gerar chaves únicas

export async function POST(request: Request) {
  try {
    // 1. Parse o FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo encontrado." },
        { status: 400 }
      );
    }

    // 2. Gerar uma chave única
    const fileExtension = file.name.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    // 3. Obter o "store" (vamos nomeá-lo 'images')
    const store = getStore("images");

    // 4. Salvar o arquivo no blob
    // O 'file' pode ser passado diretamente
    await store.set(key, file);

    // 5. Retornar a *CHAVE* (key) para o cliente, não uma URL
    return NextResponse.json({ key });
    
  } catch (error) {
    console.error("[NETLIFY_BLOB_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem." },
      { status: 500 }
    );
  }
}