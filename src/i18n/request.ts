import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Ler a língua mãe do utilizador guardada no cookie
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt"; // PT by default

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback para inglês se a língua não for suportada ou o ficheiro não existir
    messages = (await import(`../../messages/en.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
