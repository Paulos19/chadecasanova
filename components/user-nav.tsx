// components/user-nav.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Role } from "@prisma/client";
import { LayoutDashboard, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// O <Button> não é mais necessário para o trigger
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const isAdmin = user.role === Role.ADMIN;
  const fallback = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* --- MUDANÇA AQUI --- */}
        {/* Trocamos <Button> por <button> para transparência total */}
        <button className="relative h-9 w-9 rounded-full transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </button>
        {/* --- FIM DA MUDANÇA --- */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Logado como</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}