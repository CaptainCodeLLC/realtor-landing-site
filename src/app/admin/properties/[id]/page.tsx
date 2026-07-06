import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { AdminDeletePropertyButton } from "@/components/AdminDeletePropertyButton";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLeadsForProperty, getProperty } from "@/lib/cms";
import { formatMoney, operationLabel, priceSuffix } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detalle de propiedad | Administración",
  robots: { index: false, follow: false }
};

type PageProps = { params: Promise<{ id: string }> };

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short"
});

export default async function AdminPropertyDetailPage({ params }: PageProps) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const { id } = await params;
  const property = await getProperty(id);
  if (!property) {
    notFound();
  }

  const leads = await getLeadsForProperty(id);

  return (
    <main className="adminPage">
      <div className="adminTopbar">
        <section className="adminHero">
          <p className="eyebrow">Detalle de propiedad</p>
          <h1>{property.titulo}</h1>
          <p>
            {operationLabel(property.operacion)} · {property.tipo} · {property.zona}
          </p>
          <Link href={"/admin" as Route} className="adminBackLink">
            <ArrowLeft size={16} /> Volver al panel
          </Link>
        </section>
        <AdminLogoutButton />
      </div>

      <section className="adminSummary">
        <div className="adminSummaryHeader">
          <div className="adminSummaryActions">
            <Link href={`/admin/properties/${property.id}/edit` as Route} className="primaryButton">
              <Pencil size={14} /> Editar
            </Link>
            <Link href={`/properties/${property.id}` as Route} className="ghostButton" target="_blank">
              <ExternalLink size={14} /> Ver pública
            </Link>
            <AdminDeletePropertyButton
              propertyId={property.id}
              propertyTitle={property.titulo}
              redirectTo="/admin"
            />
          </div>
        </div>
        <div className="adminSummaryGrid">
          <div className="adminSummaryFacts">
            <dl>
              <div>
                <dt>Precio</dt>
                <dd>
                  {formatMoney(property.precio, property.moneda)}
                  {priceSuffix(property.operacion)}
                </dd>
              </div>
              <div>
                <dt>Zona</dt>
                <dd>{property.zona}</dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>
                  {property.ubicacion.direccion}
                  <br />
                  {property.ubicacion.ciudad}, {property.ubicacion.estado}
                </dd>
              </div>
              <div>
                <dt>Recámaras</dt>
                <dd>{property.recamaras}</dd>
              </div>
              <div>
                <dt>Baños</dt>
                <dd>{property.banos}</dd>
              </div>
              <div>
                <dt>Estacionamientos</dt>
                <dd>{property.estacionamientos}</dd>
              </div>
              <div>
                <dt>m² construidos</dt>
                <dd>{property.superficieConstruida}</dd>
              </div>
              <div>
                <dt>m² terreno</dt>
                <dd>{property.superficieTerreno}</dd>
              </div>
              <div>
                <dt>Año</dt>
                <dd>{property.anioConstruccion || "—"}</dd>
              </div>
              <div>
                <dt>Vistas</dt>
                <dd>{property.vistas}</dd>
              </div>
            </dl>
            <p className="adminSummaryDescription">{property.descripcion}</p>
          </div>
          <div className="adminSummaryPhotos">
            {property.imagenes.map((image) => (
              <img key={image} src={image} alt={property.titulo} />
            ))}
          </div>
        </div>
      </section>

      <section className="adminLeads" aria-label="Leads para esta propiedad">
        <div className="sectionIntro compactIntro">
          <p className="eyebrow">Leads recibidos</p>
          <h2>Mensajes asociados a esta propiedad</h2>
          <p>{leads.length === 0 ? "Aún no hay leads para esta propiedad." : `${leads.length} lead(s) registrados.`}</p>
        </div>
        {leads.length > 0 && (
          <div className="adminLeadsTable">
            <div className="adminLeadHeader">
              <span>Fecha</span>
              <span>Nombre</span>
              <span>Contacto</span>
              <span>Mensaje</span>
            </div>
            {leads.map((lead) => (
              <div className="adminLeadRow" key={lead.id}>
                <span>{dateFormatter.format(new Date(lead.createdAt))}</span>
                <span>{lead.nombre}</span>
                <span className="adminLeadContact">
                  <a href={`tel:${lead.telefono}`}>{lead.telefono}</a>
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : null}
                </span>
                <span className="adminLeadMessage">{lead.mensaje || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
