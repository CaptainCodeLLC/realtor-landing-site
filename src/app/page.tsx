import { LandingContent } from "@/components/LandingContent";
import { getProperties, toPublicProperty } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = (await getProperties()).filter((property) => property.disponible).map(toPublicProperty);

  return <LandingContent properties={properties} />;
}
