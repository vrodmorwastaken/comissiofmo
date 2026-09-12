import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import PanelClient from "./PanelClient";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.user.role !== "staff") redirect("/la-meva-penya");

  return <PanelClient />;
}
