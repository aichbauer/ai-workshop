import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./routing";

export type { Locale };
export { isLocale };

export async function getLocale(): Promise<Locale> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const nextLocale = cookieHeader
    .split(";")
    .map((c) => c.trim().split("="))
    .find(([name]) => name === "NEXT_LOCALE")?.[1];
  if (nextLocale && isLocale(nextLocale)) {
    return nextLocale;
  }

  const acceptLanguage = headersList.get("accept-language") ?? "";
  const firstMatch = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2))
    .find((code) => isLocale(code));
  if (firstMatch) {
    return firstMatch as Locale;
  }

  return defaultLocale;
}
