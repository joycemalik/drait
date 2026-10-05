import OpportunitiesView from "./OpportunitiesView";
import { getOpportunities } from "@/lib/data";
import { todayISO } from "@/lib/dates";

export const metadata = { title: "Opportunities" };

export default async function OpportunitiesPage() {
  const today = todayISO();
  const all = await getOpportunities();
  return <OpportunitiesView opportunities={all.filter((o) => o.deadline >= today)} />;
}
