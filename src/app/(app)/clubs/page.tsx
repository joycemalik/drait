import ClubsView from "./ClubsView";
import { getClubs } from "@/lib/data";

export const metadata = { title: "Clubs" };

export default async function ClubsPage() {
  return <ClubsView clubs={await getClubs()} />;
}
