import { useUISounds as useContextSounds } from "@/components/providers/ui-sound-provider";

/**
 * Centralised sound-effect hook for gamification feedback.
 * Now uses a global context to prevent redundant audio elements.
 *
 * @returns `{ playClick, playWhoosh, playReward, playStart, playPop, playFahh }`
 */
export const useUISounds = () => {
  return useContextSounds();
};
