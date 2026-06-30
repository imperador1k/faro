import { getUserProgress } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { InfinityIcon, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TedyLottie } from "@/components/ui/lottie-animation";
import { getTranslations } from "next-intl/server";

export const MobileHeader = async () => {
  const t = await getTranslations("shared");
  // Hidden as per user request: "EM dispositivos mobile, eu tenho um header onde têm o xp, streak e vidas. ELIMINA isso por favor"
  return null;
};
