import { LandingContent } from "@/components/LandingContent";
import { getProperties } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getProperties();

  return <LandingContent properties={properties} />;
}
