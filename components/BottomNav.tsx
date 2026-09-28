"use client";

import { Home, Compass, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Explore", icon: Compass },
  { name: "AI", icon: Sparkles },
  { name: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-around px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 0;

          return (
            <motion.button
              key={item.name}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 px-4 py-2 text-xs transition ${
                isActive ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

              <span>{item.name}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}