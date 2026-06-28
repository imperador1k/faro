import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedClient from "./feed-client";
import { getFeedPosts } from "@/actions/feed";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const includeRead = searchParams.includeRead === "true";
  const posts = await getFeedPosts(15, includeRead);

  return <FeedClient initialPosts={posts} />;
}
