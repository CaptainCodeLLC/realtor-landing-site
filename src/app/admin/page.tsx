import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import { AdminDeletePropertyButton } from "@/components/AdminDeletePropertyButton";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { countPropertiesByZone, getLeads, getProperties } from "@/lib/cms";
import { formatMoney, operationLabel, priceSuffix } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administración | Mara Barquet Realtor",
  robots: { index: false, follow: false }
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short"
});

export default async function AdministrationPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const [properties, leads, zoneCounts] = await Promise.all([
    getProperties(),
    getLeads(),
    countPropertiesByZone()
  ]);

  const leadsByProperty = leads.reduce<Record<string, number>>((accumulator, lead) => {
    if (lead.propertyId) {
      accumulator[lead.propertyId] = (accumulator[lead.propertyId] ?? 0) + 1;
    }
    return accumulator;
  }, {});

  const recentLeads = leads.slice(0, 10);
  const propertyTitles = new Map(properties.map((property) => [property.id, property.titulo]));
  const topZones = Object.entries(zoneCounts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3);

  return (
    <main className="adminPage">
      <div className="adminTopbar">
        <section className="adminHero">
          <p className="eyebrow">CMS privado</p>
          <h1>Panel de administración</h1>
          <p>
            Resumen del inventario, leads recibidos y acciones rápidas para mantener el sitio actualizado.
          </p>
        </section>
        <div className="adminTopbarActions">
          <Link href={"/admin/properties/new" as Route} className="primaryButton">
            <Plus size={16} /> Publicar nueva propiedad
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <section className="adminStats" aria-label="Resumen del inventario">
        <article className="adminStatCard">
          <span className="adminStatLabel">Propiedades publicadas</span>
          <strong className="adminStatValue">{properties.length}</strong>
        </article>
        <article className="adminStatCard">
          <span className="adminStatLabel">Leads totales</span>
          <strong className="adminStatValue">{leads.length}</strong>
        </article>
        {topZones.map(([zone, count]) => (
          <article className="adminStatCard adminStatZone" key={zone}>
            <span className="adminStatLabel">{zone}</span>
            <strong className="adminStatValue">{count}</strong>
          </article>
        ))}
      </section>

      <section className="adminList" aria-label="Propiedades publicadas">
        <div className="sectionIntro compactIntro">
          <p className="eyebrow">Inventario</p>
          <h2>Propiedades publicadas</h2>
        </div>
        <div className="adminTable">
          <div className="adminTableHeader">
            <span>Propiedad</span>
            <span>Zona</span>
            <span>Operación</span>
            <span>Precio</span>
            <span>Leads</span>
            <span>Acciones</span>
          </div>
          {properties.length === 0 && (
            <p className="adminEmpty">Aún no hay propiedades. Publica la primera para empezar.</p>
          )}
          {properties.map((property) => (
            <div className="adminRow" key={property.id}>
              <div className="adminRowMain">
                <img src={property.imagenes[0] ?? "/images/hero-property.png"} alt={property.titulo} />
                <div>
                  <strong>{property.titulo}</strong>
                  <span>
                    {property.tipo} · {property.ubicacion.ciudad}
                    {!property.disponible && <em className="adminRowUnavailable"> · No disponible</em>}
                  </span>
                </div>
              </div>
              <span className="adminRowZone">{property.zona}</span>
              <span>{operationLabel(property.operacion)}</span>
              <b>
                {formatMoney(property.precio, property.moneda)}
                {priceSuffix(property.operacion)}
              </b>
              <span className="adminRowLeads">{leadsByProperty[property.id] ?? 0}</span>
              <div className="adminRowActions">
                <Link href={`/admin/properties/${property.id}` as Route} className="ghostButton">
                  Ver
                </Link>
                <Link href={`/admin/properties/${property.id}/edit` as Route} className="ghostButton">
                  Editar
                </Link>
                <AdminDeletePropertyButton propertyId={property.id} propertyTitle={property.titulo} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="adminLeads" aria-label="Leads recientes">
        <div className="sectionIntro compactIntro">
          <p className="eyebrow">Leads recientes</p>
          <h2>Últimas solicitudes recibidas</h2>
        </div>
        {recentLeads.length === 0 ? (
          <p className="adminEmpty">Cuando alguien envíe un mensaje desde el sitio aparecerá aquí.</p>
        ) : (
          <div className="adminLeadsTable">
            <div className="adminLeadHeader">
              <span>Fecha</span>
              <span>Nombre</span>
              <span>Contacto</span>
              <span>Propiedad</span>
              <span>Mensaje</span>
            </div>
            {recentLeads.map((lead) => (
              <div className="adminLeadRow" key={lead.id}>
                <span>{dateFormatter.format(new Date(lead.createdAt))}</span>
                <span>{lead.nombre}</span>
                <span className="adminLeadContact">
                  <a href={`tel:${lead.telefono}`}>{lead.telefono}</a>
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : null}
                </span>
                <span>
                  {lead.propertyId ? (
                    <Link href={`/admin/properties/${lead.propertyId}` as Route}>
                      {propertyTitles.get(lead.propertyId) ?? "Propiedad"}
                    </Link>
                  ) : (
                    <em>Solicitud general</em>
                  )}
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
