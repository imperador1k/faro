import SavedPostsClient from "./saved-client";
import { getSavedPosts } from "@/actions/feed";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "SavedPosts" });
  return {
    title: t("metadata_title"),
  };
}

export default async function SavedPostsPage() {
  const savedPosts = await getSavedPosts();
  return <SavedPostsClient initialSavedPosts={savedPosts} />;
}
