import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft } from "lucide-react";
import { AdminListingForm } from "@/components/AdminListingForm";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva propiedad | Administración",
  robots: { index: false, follow: false }
};

export default async function NewPropertyPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <main className="adminPage">
      <div className="adminTopbar">
        <section className="adminHero">
          <p className="eyebrow">Inventario</p>
          <h1>Publicar nueva propiedad</h1>
          <p>Captura los detalles, ubicación y fotografías. Al guardar verás el listado en el panel de administración.</p>
          <Link href={"/admin" as Route} className="adminBackLink">
            <ArrowLeft size={16} /> Volver al panel
          </Link>
        </section>
        <AdminLogoutButton />
      </div>

      <AdminListingForm mode="create" />
    </main>
  );
}
