// components/logo.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold text-white"
    >
      <motion.div
        // Animação de "flutuar"
        animate={{ y: [-2, 2, -2] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <Gift className="h-6 w-6" />
      </motion.div>
      <span className="hidden sm:inline-block">Chá da Bruna</span>
    </Link>
  );
}