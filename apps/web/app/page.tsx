import { redirect } from "next/navigation";
import { getLocale } from "../lib/getLocale";

export default async function HomePage() {
  redirect(`/${await getLocale()}`);
}
