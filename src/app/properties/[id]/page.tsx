import { notFound } from "next/navigation";
import { PropertyDetailContent } from "@/components/PropertyDetailContent";
import { getProperties, getProperty } from "@/lib/cms";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({ id: property.id }));
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return { title: "Propiedad no encontrada" };
  }

  return {
    title: `${property.titulo} | Mara Barquet Realtor`,
    description: property.descripcion
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailContent property={property} />;
}
