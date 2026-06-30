import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("evaluation");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
