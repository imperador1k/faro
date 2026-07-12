"use client";

import { useState } from "react";
import { ChevronLeft, Trash2, BookmarkCheck, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toggleSave } from "@/actions/feed";

export default function SavedPostsClient({
  initialSavedPosts = [],
}: {
  initialSavedPosts?: any[];
}) {
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState(initialSavedPosts);
  const t = useTranslations("Feed");

  const handleRemove = async (id: string) => {
    // Optimistic UI Removal
    setSavedPosts(savedPosts.filter((p) => p.id !== id));
    await toggleSave(id);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-sky-500/30">
      {/* Duolingo gamified background pattern (Light & Dark) */}
      <div
        className="fixed inset-0 hidden dark:block opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div
        className="fixed inset-0 block dark:hidden opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="max-w-2xl mx-auto p-4 md:p-8 relative z-10 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-900"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300" />
          </Button>
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2">
              <BookmarkCheck className="w-8 h-8 text-amber-500" />
              {t("saved_posts_title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t("saved_posts_subtitle")}
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {savedPosts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-[32px] border-4 border-slate-300 dark:border-slate-800 border-dashed backdrop-blur-sm">
            <BookmarkCheck className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("empty_vault_title")}</h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-sm mx-auto">
              {t("empty_vault_description")}
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push("/feed")}
              className="py-3 px-8 rounded-2xl"
            >
              {t("explore_feed_button")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPosts.map((post) => {
              const isSystem = !post.authorId || post.author === "System";
              const authorName = isSystem ? "MyDuolingo" : post.author;
              const authorImg = isSystem ? "/icon.png" : post.authorImg;

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-[32px] bg-gradient-to-br ${post.bgClass} flex flex-col justify-between border-4 border-white/50 dark:border-slate-900/50 shadow-xl`}
                >
                  {/* Abstract Shape */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 dark:bg-white/5 rounded-full blur-2xl"></div>

                  <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black tracking-wider px-2 py-0.5 bg-black/10 dark:bg-white/20 rounded-full backdrop-blur-md text-slate-700 dark:text-white inline-block">
                          {post.category} • {post.cefrLevel}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-white/60">
                          {post.savedAt
                            ? new Date(post.savedAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white drop-shadow-md">
                        {post.title}
                      </h2>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => handleRemove(post.id)}
                      className="p-3 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-md hover:bg-rose-500 hover:text-white text-slate-500 dark:text-white/50 border-b-4 border-black/10 dark:border-black/20 hover:border-rose-700 shrink-0"
                      title={t("remove_from_vault_button_title")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <p className="text-slate-700 dark:text-slate-100/90 font-medium leading-relaxed relative z-10 text-[15px]">
                    {post.body}
                  </p>

                  <div className="mt-6 flex items-center justify-between relative z-10 pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-600 dark:text-white/60">
                      <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                        <img
                          src={authorImg}
                          alt={authorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{authorName}</span>
                    </div>

                    <Button variant="ghost" className="flex items-center gap-2 text-sm">
                      {t("read_original_button")}{" "}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
