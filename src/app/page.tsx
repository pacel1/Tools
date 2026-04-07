import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/constants";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
