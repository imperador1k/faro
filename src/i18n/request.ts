import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/en.json`)).default;
  }

  if (locale !== "en") {
    const enMessages = (await import(`../../messages/en.json`)).default;
    messages = deepMerge(enMessages, messages) as Record<string, unknown>;
  }

  return {
    locale,
    messages,
  };
});
