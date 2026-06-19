"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { Eye, EyeOff, Flame, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { onSelectCourse } from "@/actions/user-progress";

// Animation configuration for staggered children entry
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Card spring transition variants
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 20 },
  },
};

// Individual child items variant within card
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
};

export default function CustomSignUp() {
  const selectedCourse = useOnboardingStore((state) => state.selectedCourse);
  const motivation = useOnboardingStore((state) => state.motivation);
  const experienceLevel = useOnboardingStore((state) => state.experienceLevel);
  const placementResults = useOnboardingStore(
    (state) => state.placementResults,
  );
  const isOnboardingComplete = useOnboardingStore(
    (state) => state.isOnboardingComplete,
  );

  const { isLoaded, signUp } = useSignUp();
  const { isSignedIn } = useUser();
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  interface ClerkError {
    errors?: Array<{
      code: string;
      message: string;
      meta?: { paramName?: string };
    }>;
  }

  // Helper to translate Clerk errors
  const translateError = (err: unknown) => {
    const errorObj = err as ClerkError;
    const error = errorObj.errors?.[0];
    if (!error) return "Ocorreu um erro inesperado.";

    switch (error.code) {
      case "form_identifier_exists":
        return "Este email já está em uso.";
      case "form_password_length_too_short":
        return "A palavra-passe deve ter pelo menos 8 caracteres.";
      case "form_param_nil":
        return "Por favor, preenche todos os campos.";
      default:
        return error.message || "Erro ao criar conta.";
    }
  };

  // Handle zustand hydration and onboarding protection
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isOnboardingComplete) {
      router.push("/onboarding");
    }
  }, [isHydrated, isOnboardingComplete, router]);

  // Check if session is already active
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/learn");
    }
  }, [isLoaded, isSignedIn, router]);

  // Triggers card shake animation upon visual error notifications
  useEffect(() => {
    if (error) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const isTauriEnv =
        typeof window !== "undefined" &&
        navigator.userAgent.includes("TauriDesktop");

      if (
        typeof window !== "undefined" &&
        ((window as any).Capacitor?.isNativePlatform() || isTauriEnv)
      ) {
        const authUrl = `${window.location.origin}/mobile-auth?mode=sign-up${isTauriEnv ? "&desktop=true" : ""}`;

        if ((window as any).Capacitor?.isNativePlatform()) {
          const { Browser } = await import("@capacitor/browser");
          await Browser.open({ url: authUrl, windowName: "_system" });
          setTimeout(() => setIsLoading(false), 3000);
        } else if (isTauriEnv) {
          const { openUrl } = await import("@tauri-apps/plugin-opener");
          await openUrl(authUrl);
          setTimeout(() => setIsLoading(false), 3000);
        }
      } else {
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/learn",
        });
      }
    } catch (err) {
      console.error("Erro no registro com Google:", err);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      console.error("Erro no registro:", err);
      setError(translateError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen if not loaded, if already signed in, or if hydration/onboarding check is pending
  const showLoading =
    !isLoaded || isSignedIn || !isHydrated || !isOnboardingComplete;

  if (showLoading) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            className="w-32 h-32 relative"
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Image
              src="/marco.png"
              alt="A carregar..."
              fill
              className="object-contain"
            />
          </motion.div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 bg-[#58cc02] rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative p-4 select-none">
      {/* Background Dots Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0"></div>

      {/* Volumetric Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[130px] rounded-full pointer-events-none opacity-25 z-0 bg-[#58cc02]"></div>

      {/* Dynamic Ambient Background Elements (Desktop only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
        {/* Balão de Fala / Speech Bubble */}
        <motion.div
          className="absolute left-[8%] top-[15%]"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 6, -6, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-16 h-16 text-green-500/10 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </motion.div>

        {/* Estrela / Star */}
        <motion.div
          className="absolute left-[10%] bottom-[20%]"
          animate={{
            y: [0, 12, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <svg
            className="w-12 h-12 text-yellow-500/10 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </motion.div>

        {/* Coroa / Crown */}
        <motion.div
          className="absolute right-[8%] top-[12%]"
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <svg
            className="w-14 h-14 text-amber-500/10 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v-2h14v2z" />
          </svg>
        </motion.div>

        {/* Brilhos / Sparkles */}
        <motion.div
          className="absolute right-[12%] bottom-[22%]"
          animate={{
            scale: [0.9, 1.15, 0.9],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <svg
            className="w-16 h-16 text-sky-500/10 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M19 11.5L17.5 8.5L14.5 7L17.5 5.5L19 2.5L20.5 5.5L23.5 7L20.5 8.5L19 11.5ZM11.5 19L10 16L7 14.5L10 13L11.5 10L13 13L16 14.5L13 16L11.5 19ZM6.5 7.5L5.5 5.5L3.5 4.5L5.5 3.5L6.5 1.5L7.5 3.5L9.5 4.5L7.5 5.5L6.5 7.5Z" />
          </svg>
        </motion.div>

        {/* Livro e Chapéu de Formatura / Graduation */}
        <motion.div
          className="absolute left-[38%] top-[10%]"
          animate={{
            x: [0, 8, -8, 0],
            y: [0, -8, 8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg
            className="w-14 h-14 text-emerald-500/10 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 18.5c-3.73 0-6.75-2.01-6.75-4.5v-2.29l6.75 3.68 6.75-3.68v2.29c0 2.49-3.02 4.5-6.75 4.5z" />
          </svg>
        </motion.div>
      </div>

      {/* Main Console Hub Wrapper */}
      <div className="relative w-[92%] sm:w-full max-w-[440px] z-10 flex flex-col items-center justify-center">
        {/* Ambient Game Satellites (Desktop only) */}
        <div className="hidden lg:block">
          {/* Satellite 1: Top Left - Flame/Streak Info */}
          <motion.div
            className="absolute -left-52 top-[5%] z-10 w-44 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg border-b-4 border-b-slate-200 rounded-2xl p-3 flex items-center gap-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
              <Flame size={18} className="fill-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider leading-none">
                Ofensiva
              </p>
              <p className="text-slate-700 text-xs font-black truncate mt-1">
                30 Dias 🔥
              </p>
            </div>
          </motion.div>

          {/* Satellite 2: Top Right - Trophy/League */}
          <motion.div
            className="absolute -right-52 top-[10%] z-10 w-44 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg border-b-4 border-b-slate-200 rounded-2xl p-3 flex items-center gap-3"
            animate={{ y: [0, -7, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4.8,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
              <Trophy size={18} className="fill-yellow-500" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider leading-none">
                Liga
              </p>
              <p className="text-slate-700 text-xs font-black truncate mt-1">
                Diamante 👑
              </p>
            </div>
          </motion.div>

          {/* Satellite 3: Bottom Left - XP multiplier */}
          <motion.div
            className="absolute -left-56 bottom-[15%] z-10 w-48 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg border-b-4 border-b-slate-200 rounded-2xl p-3 flex items-center gap-3"
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5.2,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-[#1cb0f6] shrink-0">
              <TrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider leading-none">
                Bónus XP
              </p>
              <p className="text-slate-700 text-xs font-black truncate mt-1">
                2.0x Ativo ⚡
              </p>
            </div>
          </motion.div>

          {/* Satellite 4: Bottom Right - Course Progress */}
          <motion.div
            className="absolute -right-56 bottom-[12%] z-10 w-48 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg border-b-4 border-b-slate-200 rounded-2xl p-3 flex items-center gap-3"
            animate={{ y: [0, -9, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5.6,
              ease: "easeInOut",
              delay: 1.8,
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-500 shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider leading-none">
                Progresso
              </p>
              <p className="text-slate-700 text-xs font-black truncate mt-1">
                Inglês: 94% 🚀
              </p>
            </div>
          </motion.div>
        </div>

        {/* Central Tactile Authentication Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0] } : "visible"}
          className="w-full bg-white border-2 border-slate-200 border-b-[8px] rounded-[2rem] p-8 lg:p-8 relative z-20 shadow-xl shadow-slate-200/40"
        >
          {/* Mascot (Marco) Overlapping Card top */}
          <motion.div
            className="w-28 h-28 lg:w-24 lg:h-24 relative -mt-20 lg:-mt-16 mx-auto mb-2 drop-shadow-lg z-30 pointer-events-none"
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/marco.png"
              alt="Mascote Marco"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-1"
            >
              <h1 className="text-3xl lg:text-3xl font-black text-[#042c60]">
                Criar conta
              </h1>
              <p className="text-slate-400 font-bold text-xs sm:text-sm">
                Começa a tua jornada épica hoje
              </p>
            </motion.div>

            {/* Horizontal Gamified Micro-Badges */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 pt-1 pb-1"
            >
              <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1 text-orange-600 font-black text-[11px] sm:text-xs shadow-sm shadow-orange-100/50">
                <Flame size={12} className="fill-orange-500 shrink-0" />
                <span>30D</span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 rounded-full px-2.5 py-1 text-yellow-600 font-black text-[11px] sm:text-xs shadow-sm shadow-yellow-100/50">
                <Trophy size={12} className="fill-yellow-500 shrink-0" />
                <span>Diamante</span>
              </div>
              <div className="flex items-center gap-1 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-1 text-[#1cb0f6] font-black text-[11px] sm:text-xs shadow-sm shadow-sky-100/50">
                <TrendingUp size={12} className="shrink-0" />
                <span>2.0x</span>
              </div>
            </motion.div>

            {/* Authentication content */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Google Authenticator */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full h-14 lg:h-12 bg-white border-2 border-slate-200 border-b-[6px] active:border-b-2 active:translate-y-[4px] transition-all rounded-2xl flex items-center justify-center gap-3 text-slate-700 font-black hover:bg-slate-50 disabled:opacity-70 text-sm sm:text-base lg:text-sm outline-none cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Registrar com Google</span>
                  </>
                )}
              </motion.button>

              {/* Separator line */}
              <div className="flex items-center gap-3">
                <div className="h-[2px] flex-1 bg-slate-100" />
                <span className="text-slate-300 font-black text-xs sm:text-sm uppercase tracking-widest">
                  ou
                </span>
                <div className="h-[2px] flex-1 bg-slate-100" />
              </div>

              {/* E-mail / Password Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 lg:h-12 px-5 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#1cb0f6] rounded-2xl font-black text-slate-700 text-sm sm:text-base lg:text-sm focus:ring-0 outline-none transition-all"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Palavra-passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-14 lg:h-12 px-5 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#1cb0f6] rounded-2xl font-black text-slate-700 text-sm sm:text-base lg:text-sm focus:ring-0 outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>

                {/* Error Handling Area */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-rose-500 text-xs font-black text-center bg-rose-50 p-2.5 rounded-xl border border-rose-100"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit Login */}
                <motion.button
                  variants={itemVariants}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-14 lg:h-12 bg-[#58cc02] text-white border-b-[6px] border-[#46a302] hover:bg-[#4eb302] active:border-b-0 active:translate-y-[6px] transition-all rounded-2xl font-black tracking-widest uppercase flex items-center justify-center text-sm sm:text-base lg:text-sm disabled:opacity-50 outline-none cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "CRIAR CONTA"
                  )}
                </motion.button>
              </form>

              {/* Navigation Links */}
              <motion.div
                variants={itemVariants}
                className="pt-2 text-center space-y-4"
              >
                <p className="text-slate-400 font-bold text-xs sm:text-sm">
                  Já tens conta?{" "}
                  <Link
                    href="/sign-in"
                    className="text-[#1cb0f6] font-black hover:text-sky-400 hover:underline transition-colors ml-1"
                  >
                    Inicia sessão
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
