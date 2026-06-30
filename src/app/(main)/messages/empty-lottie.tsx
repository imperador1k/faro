"use client";

import Lottie from "lottie-react";
import { useTranslations } from "next-intl";
import bearDanceAnimation from "../../../../public/bear_dance.json";

export const EmptyLottie = () => {
  const t = useTranslations("messages");
  return (
    <Lottie
      animationData={bearDanceAnimation}
      loop={true}
      aria-label={t("bear_animation_label")}
    />
  );
};
