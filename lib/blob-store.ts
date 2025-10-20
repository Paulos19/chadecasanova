// lib/blob-store.ts (Corrigido)
import { getStore, Store } from "@netlify/blobs";

export function getNetlifyStore(name: string): Store {
  // Em Produção, o Netlify injeta o ambiente.
  // A chamada de argumento único 'getStore(name)' funciona.
  if (process.env.NODE_ENV === "production") {
    return getStore(name);
  }

  // Em Desenvolvimento, devemos passar TODAS as opções em um
  // único objeto de configuração.
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;

  if (!siteID || !token) {
    throw new Error(
      "Credenciais do Netlify Blobs (NETLIFY_SITE_ID, NETLIFY_BLOBS_TOKEN) não encontradas no .env"
    );
  }

  // CORREÇÃO:
  // Passar 'name', 'siteID', e 'token'
  // dentro de um ÚNICO argumento de objeto.
  return getStore({
    name: name,
    siteID: siteID,
    token: token,
  });
}