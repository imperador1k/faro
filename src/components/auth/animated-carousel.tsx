"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const CAROUSEL_ITEMS = [
  {
    id: 0,
    titleKey: "carousel_1_title",
    descKey: "carousel_1_desc",
    image: "/marco.png", // Or a specific gamified illustration
    bgColor: "from-blue-900 to-slate-900",
  },
  {
    id: 1,
    titleKey: "carousel_2_title",
    descKey: "carousel_2_desc",
    image: "/marco.png",
    bgColor: "from-green-900 to-slate-900",
  },
  {
    id: 2,
    titleKey: "carousel_3_title",
    descKey: "carousel_3_desc",
    image: "/marco.png",
    bgColor: "from-purple-900 to-slate-900",
  },
];

export function AnimatedCarousel() {
  const t = useTranslations("Auth");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = CAROUSEL_ITEMS[currentIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login.png"
          alt="Login Background"
          fill
          unoptimized
          className="object-cover"
          priority
        />
        {/* Gradient overlay: darker at the bottom for text, transparent at the top to keep the image vivid */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Main Logo Top Left */}
      <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 drop-shadow-md hover:opacity-80 transition-opacity">
        <Image src="/faro_icon.png" alt="Faro Logo" width={32} height={32} />
        <span className="text-white font-black text-2xl tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          FARO
        </span>
      </Link>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center max-w-md px-8 text-center z-10"
        >
          {/* Animated Text Section */}

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {t(currentItem.titleKey as any)}
          </h2>
          <p className="text-lg md:text-xl text-white font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {t(currentItem.descKey as any)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-12 flex gap-3 z-20">
        {CAROUSEL_ITEMS.map((item, idx) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full p-0 transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
