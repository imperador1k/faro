"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, Key, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Helper to translate Clerk errors
  const translateError = (err: any) => {
    const error = err.errors?.[0];
    if (!error) return "Ocorreu um erro inesperado.";

    console.log("Clerk Error:", error.code, error.message);

    switch (error.code) {
      case "form_identifier_not_found":
        return "Não encontrámos nenhuma conta com este email.";
      case "form_password_pwned":
        return "Esta palavra-passe foi encontrada numa fuga de dados. Escolhe outra.";
      case "form_password_length_too_short":
        return "A palavra-passe deve ter pelo menos 8 caracteres.";
      case "verification_failed":
        return "Código inválido. Verifica o teu email e tenta novamente.";
      case "form_param_format_invalid":
        if (error.meta?.paramName === "code") return "O formato do código é inválido.";
        return "Formato inválido.";
      case "form_param_nil":
        return "Por favor, preenche todos os campos.";
      case "session_exists":
        return "Já tens uma sessão ativa.";
      default:
        if (error.message.toLowerCase().includes("is invalid")) return "Código inválido.";
        return error.message;
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/learn");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep(2);
    } catch (err: any) {
      setError(translateError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setError("");
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/learn");
      }
    } catch (err: any) {
      const errorMsg = translateError(err);
      setError(errorMsg);
      
      // If code is invalid, send them back to step 2
      if (err.errors?.[0]?.code === "verification_failed" || err.errors?.[0]?.message.toLowerCase().includes("invalid")) {
        setStep(2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#f7f7f7] lg:bg-slate-50 p-4 sm:p-6 overflow-hidden relative font-nunito">
      
      {/* Background Particles (Reuse sign-in style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
              y: [0, -100, 0],
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              delay: i * 2
            }}
            className="absolute rounded-full bg-[#58cc02]/10"
            style={{
              width: 150 + i * 30,
              height: 150 + i * 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden relative z-10"
      >
        <div className="flex flex-col lg:row w-full lg:flex-row">
          {/* Left Side: Mascot (Desktop) */}
          <div className="hidden lg:flex lg:w-5/12 bg-sky-500 p-12 flex-col items-center justify-center text-white text-center relative overflow-hidden">
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -right-10 w-64 h-64 border-[30px] border-white/5 rounded-full"
            />
            
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 h-56 relative mb-8 mx-auto"
              >
                <Image
                  src="/marco.png"
                  alt="Marco"
                  fill
                  className="object-contain drop-shadow-2xl brightness-110"
                />
              </motion.div>
              <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Não te <br /> preocupes!</h2>
              <p className="text-white/90 font-bold text-lg max-w-[240px] mx-auto leading-relaxed">
                Até o Marco se esquece de onde deixou as sementes às vezes. 😅
              </p>
            </div>
          </div>

          {/* Right Side: Flow */}
          <div className="w-full lg:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative min-h-[500px]">
             {/* Back Button */}
             <button 
              onClick={() => {
                if (step === 1) router.back();
                else setStep(step - 1);
              }}
              className="absolute top-8 left-8 p-2 text-slate-400 hover:text-slate-600 transition-colors group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="w-full max-w-sm mx-auto">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Mail size={32} />
                      </div>
                      <h1 className="text-3xl font-black text-[#042c60]">Recuperar Acesso</h1>
                      <p className="text-slate-400 font-bold text-base">Introduz o teu email para receberes um código</p>
                    </div>

                    <form onSubmit={handleRequestCode} className="space-y-6">
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="O teu email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full h-14 px-6 bg-slate-100/50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-all text-base"
                        />
                      </div>

                      {error && (
                        <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-1">
                          {error}
                        </p>
                      )}

                      <button
                        disabled={isLoading || !email}
                        className="w-full h-14 bg-sky-500 border-b-4 border-sky-600 rounded-2xl flex items-center justify-center font-black text-white uppercase tracking-[0.2em] shadow-lg hover:bg-sky-600 active:border-b-0 active:translate-y-[4px] transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "ENVIAR CÓDIGO"
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Key size={32} />
                      </div>
                      <h1 className="text-3xl font-black text-[#042c60]">Verifica o Email</h1>
                      <p className="text-slate-400 font-bold text-base">Enviámos um código para <span className="text-sky-500">{email}</span></p>
                    </div>

                    <div className="space-y-6">
                      <input
                        type="text"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full h-14 px-6 bg-slate-100/50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all text-base tracking-[0.5em] text-center"
                      />

                      {error && (
                        <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                          {error}
                        </p>
                      )}

                      <button
                        onClick={() => {
                          if (code.length === 6) {
                            setStep(3);
                            setError("");
                          }
                        }}
                        disabled={isLoading || code.length !== 6}
                        className="w-full h-14 bg-amber-500 border-b-4 border-amber-600 rounded-2xl flex items-center justify-center font-black text-white uppercase tracking-[0.2em] shadow-lg hover:bg-amber-600 active:border-b-0 active:translate-y-[4px] transition-all disabled:opacity-50"
                      >
                         CONTINUAR
                      </button>

                      <p className="text-center text-sm font-bold text-slate-400">
                        Não recebeste?{" "}
                        <button 
                          onClick={handleRequestCode}
                          className="text-sky-500 hover:underline"
                        >
                          Reenviar código
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <ShieldCheck size={32} />
                      </div>
                      <h1 className="text-3xl font-black text-[#042c60]">Nova Password</h1>
                      <p className="text-slate-400 font-bold text-base">Cria uma palavra-passe forte e segura</p>
                    </div>

                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (password !== confirmPassword) {
                          setError("As palavras-passe não coincidem.");
                          return;
                        }
                        handleResetPassword(e);
                      }} 
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nova palavra-passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            className="w-full h-14 px-6 bg-slate-100/50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all text-base pr-14"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirmar palavra-passe"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full h-14 px-6 bg-slate-100/50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all text-base"
                        />
                      </div>

                      {error && (
                        <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                          {error}
                        </p>
                      )}

                      <button
                        disabled={isLoading || password.length < 8 || !confirmPassword}
                        className="w-full h-14 bg-[#58cc02] border-b-4 border-[#46a302] rounded-2xl flex items-center justify-center font-black text-white uppercase tracking-[0.2em] shadow-lg hover:bg-[#4eb302] active:border-b-0 active:translate-y-[4px] transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "REDEFINIR E ENTRAR"
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 text-center">
                <Link href="/sign-in" className="text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm flex items-center justify-center gap-2">
                   Voltar para o Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
