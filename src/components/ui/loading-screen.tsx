import { useTranslations } from "next-intl";
import { LoopingFlowerLottie } from "@/components/ui/lottie-animation";

export const LoadingScreen = () => {
  const t = useTranslations("ui");
  return (
    <div className="flex h-full w-full min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-900 z-50">
      <LoopingFlowerLottie className="w-48 h-48 lg:w-64 lg:h-64" />
      <h2 className="mt-4 text-xl font-bold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
        {t("loading")}
      </h2>
    </div>
  );
};
