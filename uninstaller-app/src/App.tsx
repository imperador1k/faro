import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AlertCircle, Trash2, Loader2, Bug, GraduationCap, Clock, BellOff, HelpCircle, ChevronRight } from "lucide-react";
import "./index.css";

const buttonStyle = (
  isHovered: boolean,
  disabled: boolean = false,
  variant: "primary" | "destructive" | "outline" | "ghost" = "primary"
) => {
  let bg = "transparent";
  let border = "transparent";
  let text = "white";

  if (disabled) {
    bg = "rgba(100, 116, 139, 0.5)";
    border = "rgba(100, 116, 139, 0.3)";
    text = "rgba(255,255,255,0.5)";
  } else {
    switch (variant) {
      case "primary":
        bg = isHovered ? "rgba(79, 70, 229, 0.9)" : "rgba(79, 70, 229, 0.7)";
        border = "rgba(129, 140, 248, 0.5)";
        break;
      case "destructive":
        bg = isHovered ? "rgba(239, 68, 68, 0.9)" : "rgba(239, 68, 68, 0.7)";
        border = "rgba(248, 113, 113, 0.5)";
        break;
      case "outline":
        bg = isHovered ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)";
        border = "rgba(255, 255, 255, 0.2)";
        break;
      case "ghost":
        bg = isHovered ? "rgba(255, 255, 255, 0.05)" : "transparent";
        text = isHovered ? "white" : "rgba(255,255,255,0.7)";
        break;
    }
  }

  return {
    width: "100%",
    padding: "0.875rem 2rem",
    backgroundColor: bg,
    color: text,
    fontWeight: "bold" as const,
    borderRadius: "0.75rem",
    border: `1px solid ${border}`,
    boxShadow: disabled || variant === "ghost" ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.2s ease-in-out",
    cursor: disabled ? "not-allowed" : "pointer",
    transform: isHovered && !disabled && variant !== "ghost" ? "translateY(-1px)" : "translateY(0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  };
};

const surveyOptions = [
  { id: "bugs", icon: Bug, text: "Encontrei demasiados bugs/erros" },
  { id: "better", icon: GraduationCap, text: "O Duolingo original é melhor" },
  { id: "time", icon: Clock, text: "Não tenho tempo para aprender agora" },
  { id: "notifications", icon: BellOff, text: "Estou farto de receber notificações" },
  { id: "other", icon: HelpCircle, text: "Outro motivo..." },
];

function App() {
  const [step, setStep] = useState<"survey" | "guilt" | "uninstalling" | "success" | "error">("survey");
  const [faroStatus, setFaroStatus] = useState<"running" | "stopped">("stopped");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
  // Hover states for buttons
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isNextHovered, setIsNextHovered] = useState(false);
  const [isSkipHovered, setIsSkipHovered] = useState(false);
  const [isUninstallHovered, setIsUninstallHovered] = useState(false);
  const [isStayHovered, setIsStayHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    invoke("get_faro_status").then((res: any) => {
      setFaroStatus(res);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (step === "uninstalling") {
      // Fake progress bar that lasts 3 seconds before calling the real uninstall
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) {
            clearInterval(interval);
            return 90; // Wait at 90% for the real command to finish
          }
          return p + 10;
        });
      }, 300);

      invoke("perform_uninstall")
        .then(() => {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => setStep("success"), 500);
          
          setTimeout(async () => {
            const { getCurrentWindow } = await import("@tauri-apps/api/window");
            getCurrentWindow().close();
          }, 3000);
        })
        .catch((e) => {
          console.error(e);
          setStep("error");
        });
        
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCancel = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    getCurrentWindow().close();
  };

  return (
    <div 
      className="min-h-screen bg-transparent flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30"
      data-tauri-drag-region
    >
      <div 
        className="w-full max-w-md backdrop-blur-2xl bg-slate-900/85 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative transition-all duration-500"
        data-tauri-drag-region
      >
        {/* Top Progress Bar indicator */}
        <div className="absolute top-0 inset-x-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: step === "survey" ? "25%" : step === "guilt" ? "50%" : step === "uninstalling" ? `${progress}%` : "100%" }}
          />
        </div>
        
        <div className="p-8 text-center min-h-[420px] flex flex-col justify-center">
          
          {/* STEP 1: SURVEY */}
          {step === "survey" && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Porquê partir?</h1>
              <p className="text-slate-400 text-sm mb-6">
                Estamos sempre a tentar melhorar. Diz-nos o que falhou para podermos evoluir.
              </p>

              <div className="flex flex-col w-full gap-2 mb-6">
                {surveyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedReason(opt.id)}
                    onMouseEnter={() => setHoveredOption(opt.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3"
                    style={{
                      backgroundColor: selectedReason === opt.id ? "rgba(99, 102, 241, 0.2)" : (hoveredOption === opt.id ? "rgba(255,255,255,0.05)" : "transparent"),
                      borderColor: selectedReason === opt.id ? "rgba(99, 102, 241, 0.5)" : "rgba(255,255,255,0.1)",
                      color: selectedReason === opt.id ? "white" : "rgba(255,255,255,0.8)"
                    }}
                  >
                    <opt.icon className={`w-5 h-5 ${selectedReason === opt.id ? "text-indigo-400" : "text-slate-400"}`} />
                    <span className="text-sm font-medium">{opt.text}</span>
                  </button>
                ))}
              </div>

              <div className="flex w-full gap-3 mt-auto">
                <button
                  onClick={() => setStep("guilt")}
                  onMouseEnter={() => setIsSkipHovered(true)}
                  onMouseLeave={() => setIsSkipHovered(false)}
                  style={{...buttonStyle(isSkipHovered, false, "ghost"), flex: 1}}
                >
                  Saltar
                </button>
                <button
                  onClick={() => setStep("guilt")}
                  disabled={!selectedReason}
                  onMouseEnter={() => setIsNextHovered(true)}
                  onMouseLeave={() => setIsNextHovered(false)}
                  style={{...buttonStyle(isNextHovered, !selectedReason, "primary"), flex: 1}}
                >
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GUILT TRIP */}
          {step === "guilt" && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                <Trash2 className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">É mesmo o fim? 😢</h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
                O Faro vai sentir a tua falta. O teu progresso na Nuvem ficará guardado caso mudes de ideias no futuro, mas os ficheiros e as tuas configurações locais serão <b>completamente eliminados</b>.
              </p>

              {faroStatus === "running" && (
                <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 text-xs text-left w-full mb-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>O Faro está aberto em segundo plano. Iremos forçar o seu encerramento.</span>
                </div>
              )}

              <div className="flex flex-col w-full gap-3 mt-4">
                <button
                  onClick={handleCancel}
                  onMouseEnter={() => setIsStayHovered(true)}
                  onMouseLeave={() => setIsStayHovered(false)}
                  style={buttonStyle(isStayHovered, false, "primary")}
                >
                  Mudei de ideias, quero ficar! ❤️
                </button>
                <button
                  onClick={() => setStep("uninstalling")}
                  onMouseEnter={() => setIsUninstallHovered(true)}
                  onMouseLeave={() => setIsUninstallHovered(false)}
                  style={buttonStyle(isUninstallHovered, false, "destructive")}
                >
                  <Trash2 className="w-4 h-4" />
                  Sim, destruir ficheiros
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: UNINSTALLING */}
          {step === "uninstalling" && (
            <div className="flex flex-col items-center justify-center h-full gap-8 animate-in fade-in duration-500 flex-1 py-12">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-300">{progress}%</span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">A desinstalar o Faro...</h2>
                <p className="text-slate-400 text-sm mt-2">A limpar chaves de registo e ficheiros residuais.</p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full gap-6 animate-in zoom-in-95 duration-500 py-12">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Desinstalado!</h2>
                <p className="text-slate-400 text-sm">O Faro foi removido com sucesso do teu sistema.<br/>Até uma próxima viagem!</p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {step === "error" && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Ocorreu um erro</h2>
                <p className="text-red-400 text-sm mb-6">Não foi possível concluir a desinstalação automaticamente.</p>
                <button
                  onClick={handleCancel}
                  onMouseEnter={() => setIsStayHovered(true)}
                  onMouseLeave={() => setIsStayHovered(false)}
                  style={buttonStyle(isStayHovered, false, "outline")}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
