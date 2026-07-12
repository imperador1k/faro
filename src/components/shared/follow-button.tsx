"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/user-actions";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  userId: string;
  isFollowing: boolean;
  className?: string;
};

export const FollowButton = ({ userId, isFollowing, className }: Props) => {
  const t = useTranslations("shared");
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      if (isFollowing) {
        onUnfollow(userId);
      } else {
        onFollow(userId);
      }
    });
  };

  if (isFollowing) {
    return (
      <Button
        variant="destructive"
        className={cn(
          "rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 whitespace-nowrap",
          className,
        )}
        onClick={onClick}
        disabled={pending}
      >
        {pending && <Loader2 className="w-5 h-5 animate-spin" />}
        {t("unfollow")}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      className={cn(
        "rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 whitespace-nowrap",
        className,
      )}
      onClick={onClick}
      disabled={pending}
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
      {t("follow")}
    </Button>
  );
};
