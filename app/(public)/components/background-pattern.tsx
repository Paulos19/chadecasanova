// app/(public)/components/background-pattern.tsx
"use client";

import { motion } from "framer-motion";
import {
  BedDouble,
  CookingPot,
  Gift,
  Heart,
  Home,
  Refrigerator,
  Utensils,
  Sofa,
} from "lucide-react";
import { useState, useEffect } from "react";

// Lista de ícones para usar
const icons = [
  Home,
  Gift,
  Heart,
  CookingPot,
  BedDouble,
  Refrigerator,
  Utensils,
  Sofa,
];

// Tipo para nossos ícones do padrão
type PatternIcon = {
  Icon: React.ElementType;
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

// --- CORREÇÃO AQUI ---
// Mover a constante para o escopo do componente
const patternSize = 200; // Nosso <pattern> tem 200x200

export function BackgroundPattern() {
  // Inicia vazio para evitar hydration mismatch
  const [pattern, setPattern] = useState<PatternIcon[]>([]);

  useEffect(() => {
    // --- LÓGICA DO GRID PARA ESPAÇAMENTO ---
    const gridSize = 4; // Vamos criar um grid 4x4
    // const patternSize = 200; // <-- Esta linha foi movida para cima
    const cellSize = patternSize / gridSize; // Cada célula terá 50x50
    const iconSize = 24; // Ícones Lucide são 24x24
    
    // O espaço máximo que o ícone pode se mover dentro da célula
    const maxOffset = cellSize - iconSize; 
    
    const newPattern: PatternIcon[] = [];
    let iconIndex = 0;

    for (let i = 0; i < gridSize; i++) { // Colunas (x)
      for (let j = 0; j < gridSize; j++) { // Linhas (y)
        
        // 75% de chance de colocar um ícone, para ficar mais "espaçado"
        if (Math.random() > 0.25) { 
          const IconComponent = icons[iconIndex % icons.length];
          
          const baseX = i * cellSize;
          const baseY = j * cellSize;

          const x = baseX + (Math.random() * maxOffset);
          const y = baseY + (Math.random() * maxOffset);

          newPattern.push({
            Icon: IconComponent,
            x: x,
            y: y,
            rotate: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4,
          });

          iconIndex++;
        }
      }
    }
    
    setPattern(newPattern);
  }, []); // O array vazio [] garante que isso rode apenas uma vez no cliente

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="whatsapp-texture"
            patternUnits="userSpaceOnUse"
            width={patternSize} // <-- Agora funciona
            height={patternSize} // <-- Agora funciona
          >
            {pattern.map((icon, i) => (
              <motion.g
                key={i}
                initial={{ rotate: icon.rotate }}
                animate={{
                  scale: [
                    icon.scale,
                    icon.scale * 1.1,
                    icon.scale,
                  ],
                  rotate: [
                    icon.rotate,
                    icon.rotate + 10,
                    icon.rotate,
                  ],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <icon.Icon
                  x={icon.x}
                  y={icon.y}
                  strokeWidth={1.5}
                  className="text-white opacity-5"
                />
              </motion.g>
            ))}
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#whatsapp-texture)"
        />
      </svg>
    </div>
  );
}