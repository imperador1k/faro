"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { checkStreakStatus } from "@/actions/user-progress";
import { StreakModal } from "@/components/modals/streak-modal";

export const StreakCheck = () => {
  const t = useTranslations("shared");
  const [streakLost, setStreakLost] = useState(false);
  const [lostDays, setLostDays] = useState(0);

  useEffect(() => {
    checkStreakStatus()
      .then((res) => {
        if (res.streakLost && "days" in res) {
          setLostDays(res.days || 0);
          setStreakLost(true);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <StreakModal
      open={streakLost}
      onOpenChange={setStreakLost}
      streak={lostDays}
      variant="lost"
    />
  );
};
