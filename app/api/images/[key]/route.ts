// app/api/images/[key]/route.ts
import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  if (!key) {
    return new NextResponse("Chave não fornecida", { status: 400 });
  }

  try {
    const store = getStore("images");

    // 'get' com type: "blob" retorna o arquivo como um Blob
    const blobData = await store.get(key, { type: "blob" });

    if (!blobData) {
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    // Retorna o blob da imagem com o Content-Type correto
    return new Response(blobData, {
      headers: {
        "Content-Type": blobData.type,
      },
    });
  } catch (error) {
    console.error("[NETLIFY_BLOB_GET_ERROR]", error);
    return new NextResponse("Erro interno ao buscar imagem", {
      status: 500,
    });
  }
}