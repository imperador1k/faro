"use client";

import { createContext, useContext } from "react";
import useSound from "use-sound";

type UISoundsContextType = {
  playClick: () => void;
  playWhoosh: () => void;
  playReward: () => void;
  playStart: () => void;
  playPop: () => void;
  playFahh: () => void;
};

const UISoundsContext = createContext<UISoundsContextType | null>(null);

export const UISoundsProvider = ({ children }: { children: React.ReactNode }) => {
  const [playClick] = useSound("/sounds/click.mp3", { volume: 0.5 });
  const [playWhoosh] = useSound("/sounds/whoosh.mp3", { volume: 0.4 });
  const [playReward] = useSound("/sounds/reward.mp3", { volume: 0.6 });
  const [playStart] = useSound("/sounds/start.mp3", { volume: 0.6 });
  const [playPop] = useSound("/sounds/pop.mp3", { volume: 0.4 });
  const [playFahh] = useSound("/sounds/fahh.mp3", { volume: 0.6 });

  return (
    <UISoundsContext.Provider
      value={{
        playClick: () => playClick(),
        playWhoosh: () => playWhoosh(),
        playReward: () => playReward(),
        playStart: () => playStart(),
        playPop: () => playPop(),
        playFahh: () => playFahh(),
      }}
    >
      {children}
    </UISoundsContext.Provider>
  );
};

export const useUISounds = () => {
  const context = useContext(UISoundsContext);
  if (!context) {
    // If not wrapped in provider (e.g. testing or error boundary), return noop functions
    return {
      playClick: () => {},
      playWhoosh: () => {},
      playReward: () => {},
      playStart: () => {},
      playPop: () => {},
      playFahh: () => {},
    };
  }
  return context;
};
