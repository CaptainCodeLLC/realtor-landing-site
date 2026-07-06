import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminListingForm } from "@/components/AdminListingForm";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProperty } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editar propiedad | Administración",
  robots: { index: false, follow: false }
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: PageProps) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const { id } = await params;
  const property = await getProperty(id);
  if (!property) {
    notFound();
  }

  return (
    <main className="adminPage">
      <div className="adminTopbar">
        <section className="adminHero">
          <p className="eyebrow">Inventario</p>
          <h1>Editar propiedad</h1>
          <p>Modifica los datos de la propiedad. Los cambios se publican inmediatamente en el sitio.</p>
          <Link href={`/admin/properties/${property.id}` as Route} className="adminBackLink">
            <ArrowLeft size={16} /> Volver al detalle
          </Link>
        </section>
        <AdminLogoutButton />
      </div>

      <AdminListingForm mode="edit" initial={property} />
    </main>
  );
}
