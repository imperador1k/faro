import { getPendingPosts } from "@/actions/admin-feed";
import { AdminFeedClient } from "./admin-feed-client";

export const dynamic = "force-dynamic";

export default async function AdminFeedPage() {
  const pendingPosts = await getPendingPosts();

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Moderação do Feed
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Aprova ou rejeita posts criados pelos utilizadores.
        </p>
      </div>

      <AdminFeedClient initialPosts={pendingPosts} />
    </div>
  );
}
