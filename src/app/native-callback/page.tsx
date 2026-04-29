"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function NativeCallbackPage() {
    useEffect(() => {
        // Redireciona de volta para a App usando o custom scheme
        // Passamos exatamente os mesmos query parameters que o Google nos enviou
        const queryParams = window.location.search;
        window.location.href = `myduolingo://native-callback${queryParams}`;
        
        // Timeout de segurança caso o utilizador não tenha a app instalada
        // (Não deve acontecer porque isto só é chamado pela App)
        const timeout = setTimeout(() => {
            document.getElementById('fallback-msg')!.style.display = 'block';
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white flex-col gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <p className="text-slate-500 font-bold">A voltar para a App...</p>
            <p id="fallback-msg" className="text-xs text-slate-400 hidden mt-4 text-center px-6">
                Se a aplicação não abrir automaticamente, fecha esta janela e volta à aplicação.
            </p>
        </div>
    );
}
