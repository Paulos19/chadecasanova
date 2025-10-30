// app/(public)/components/search-input.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // O useDebouncedCallback aguarda 300ms após o usuário parar de digitar
  // antes de executar a função.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // Atualiza a URL com o parâmetro de busca.
    // O Next.js detectará essa mudança e re-renderizará
    // o Server Component (a página) com os novos dados.
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative mb-8 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Buscar pelo nome do presente..."
        // Define o valor padrão com base no que já está na URL
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        // Estilização para o fundo escuro e ícone
        className="h-12 pl-10 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:ring-white focus:border-white"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
    </div>
  );
}