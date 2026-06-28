"use client";

import { useState } from "react";
import { updatePostStatus } from "@/actions/admin-feed";
import { Check, X, ImageIcon } from "lucide-react";
import Image from "next/image";

type PendingPost = {
  id: string;
  title: string;
  body: string;
  category: string;
  targetLanguage: string;
  imageBase64: string | null;
  originalSourceUrl: string | null;
  createdAt: Date;
};

export const AdminFeedClient = ({
  initialPosts,
}: {
  initialPosts: PendingPost[];
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAction = async (
    postId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    setIsProcessing(postId);
    try {
      const res = await updatePostStatus(postId, status);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
          Tudo Limpo!
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Não há novos posts pendentes para aprovação.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-sm"
        >
          {/* Post Image Preview */}
          <div className="w-full md:w-48 h-48 bg-stone-100 dark:bg-slate-800 rounded-xl border-2 border-stone-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 relative">
            {post.imageBase64 ? (
              <Image
                src={post.imageBase64}
                alt="Post image"
                fill
                className="object-cover"
              />
            ) : post.originalSourceUrl ? (
              <Image
                src={post.originalSourceUrl}
                alt="Post image"
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-stone-300 dark:text-slate-600" />
            )}
          </div>

          {/* Post Content Preview */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-x-2 mb-2">
              <span className="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-md">
                {post.category}
              </span>
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                {post.targetLanguage}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1">
              {post.body}
            </p>

            <div className="flex items-center gap-x-3 mt-auto pt-4 border-t-2 border-stone-100 dark:border-slate-800">
              <button
                onClick={() => handleAction(post.id, "APPROVED")}
                disabled={isProcessing === post.id}
                className="flex-1 flex items-center justify-center gap-x-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-black uppercase tracking-wider text-sm py-3 rounded-xl transition-all border-b-4 border-green-700 active:border-b-0 active:translate-y-[4px] disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {isProcessing === post.id ? "..." : "Aprovar"}
              </button>

              <button
                onClick={() => handleAction(post.id, "REJECTED")}
                disabled={isProcessing === post.id}
                className="flex items-center justify-center gap-x-2 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-500 dark:text-slate-400 font-black uppercase tracking-wider text-sm py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
