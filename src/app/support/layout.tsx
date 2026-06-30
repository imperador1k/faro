import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("support_page");
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/support",
    },
  };
}

export { default } from "./page";
