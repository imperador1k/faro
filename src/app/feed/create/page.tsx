import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreatePostClient } from "./create-post-client";

export default async function CreatePostPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[100dvh] bg-stone-100 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <CreatePostClient />
      </div>
    </div>
  );
}
