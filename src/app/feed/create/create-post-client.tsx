"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createUserPost } from "@/actions/create-post";
import { Upload, X, Send, Image as ImageIcon, ChevronLeft } from "lucide-react";
import Image from "next/image";

export const CreatePostClient = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Curiosidade");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("A imagem não pode ter mais de 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      setError("O título e o texto são obrigatórios.");
      return;
    }

    const wordCount = body.trim().split(/\s+/).length;
    if (wordCount < 10) {
      setError("O post tem de ter no mínimo 10 palavras.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await createUserPost({
      title,
      body,
      category,
      cefrLevel: "B1", // Default for user posts for now
      imageBase64,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/feed");
      }, 3000);
    } else {
      setError(res.error || "Erro desconhecido.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border-2 border-stone-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">
          Post Enviado!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          O teu post foi enviado para moderação. Assim que for aprovado, vai
          aparecer no Feed para toda a gente!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-xl border-2 border-stone-200 dark:border-slate-800">
      <div className="mb-8 flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-stone-100 dark:bg-slate-800 rounded-2xl hover:bg-stone-200 dark:hover:bg-slate-700 transition-all active:scale-95 shrink-0"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            Criar Nova Curiosidade
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Partilha uma curiosidade incrível com a comunidade. Todos os posts
            são validados antes de aparecerem.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        {error && (
          <div className="bg-rose-100 text-rose-600 p-4 rounded-xl font-bold text-sm">
            {error}
          </div>
        )}

        {/* Image Upload Area */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Imagem de Fundo (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {imageBase64 ? (
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-slate-700 group">
              <Image
                src={imageBase64}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-4 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                  Mudar
                </button>
                <button
                  type="button"
                  onClick={() => setImageBase64(null)}
                  className="bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 md:h-64 rounded-2xl border-4 border-dashed border-stone-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors flex flex-col items-center justify-center gap-y-4 text-slate-400 hover:text-sky-500 bg-stone-50 dark:bg-slate-800/50"
            >
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <span className="font-bold">Clica para enviar uma imagem</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: O segredo da Torre Eiffel"
            className="w-full bg-stone-100 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500 rounded-xl px-4 py-4 font-bold text-slate-800 dark:text-white outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Texto (Curiosidade)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Sabias que a Torre Eiffel encolhe cerca de 15 cm no inverno por causa do frio?"
            rows={4}
            className="w-full bg-stone-100 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500 rounded-xl px-4 py-4 font-bold text-slate-800 dark:text-white outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-stone-100 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500 rounded-xl px-4 py-4 font-bold text-slate-800 dark:text-white outline-none transition-colors cursor-pointer"
            >
              <option value="Curiosidade">Curiosidade</option>
              <option value="História">História</option>
              <option value="Ciência">Ciência</option>
              <option value="Cultura">Cultura</option>
              <option value="Tecnologia">Tecnologia</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-[#1CB0F6] hover:bg-[#1899D6] active:bg-[#1582B7] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-wider transition-all border-b-4 border-[#0092d6] active:border-b-0 active:translate-y-[4px] disabled:opacity-50 flex items-center justify-center gap-x-2"
        >
          {isSubmitting ? "A Enviar..." : "Enviar para Aprovação"}
        </button>
      </form>
    </div>
  );
};
