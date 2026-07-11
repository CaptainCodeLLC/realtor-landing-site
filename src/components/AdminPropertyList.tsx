"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AdminDeletePropertyButton } from "@/components/AdminDeletePropertyButton";
import { formatMoney, operationLabel, priceSuffix } from "@/lib/format";
import type { Operation, Property, PropertyType } from "@/types/property";
import { propertyTypes } from "@/types/property";

type AdminPropertyListProps = {
  properties: Property[];
  leadsByProperty: Record<string, number>;
};

type Filters = {
  busqueda: string;
  operacion: Operation | "todas";
  tipo: PropertyType | "todos";
  disponibilidad: "todas" | "disponible" | "no_disponible";
};

const defaultFilters: Filters = {
  busqueda: "",
  operacion: "todas",
  tipo: "todos",
  disponibilidad: "todas"
};

export function AdminPropertyList({ properties, leadsByProperty }: AdminPropertyListProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const hasActiveFilters =
    filters.busqueda.trim() !== "" ||
    filters.operacion !== "todas" ||
    filters.tipo !== "todos" ||
    filters.disponibilidad !== "todas";

  const filteredProperties = useMemo(() => {
    const search = filters.busqueda.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !search ||
        [property.titulo, property.tipo, property.zona, property.ubicacion.ciudad, property.ubicacion.estado]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesOperation = filters.operacion === "todas" || property.operacion === filters.operacion;
      const matchesTipo = filters.tipo === "todos" || property.tipo === filters.tipo;
      const matchesDisponibilidad =
        filters.disponibilidad === "todas" ||
        (filters.disponibilidad === "disponible" ? property.disponible : !property.disponible);

      return matchesSearch && matchesOperation && matchesTipo && matchesDisponibilidad;
    });
  }, [filters, properties]);

  return (
    <>
      <div className="adminFilterBar" aria-label="Filtrar propiedades">
        <input
          className="adminFilterSearch"
          type="search"
          value={filters.busqueda}
          onChange={(event) => setFilters((current) => ({ ...current, busqueda: event.target.value }))}
          placeholder="Buscar por título, tipo o zona…"
        />

        <select
          value={filters.operacion}
          onChange={(event) =>
            setFilters((current) => ({ ...current, operacion: event.target.value as Filters["operacion"] }))
          }
        >
          <option value="todas">Toda operación</option>
          <option value="venta">Venta</option>
          <option value="renta">Renta</option>
          <option value="renta_temporal">Renta temporal</option>
        </select>

        <select
          value={filters.tipo}
          onChange={(event) => setFilters((current) => ({ ...current, tipo: event.target.value as Filters["tipo"] }))}
        >
          <option value="todos">Todo tipo</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.disponibilidad}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              disponibilidad: event.target.value as Filters["disponibilidad"]
            }))
          }
        >
          <option value="todas">Disponible y no disponible</option>
          <option value="disponible">Solo disponibles</option>
          <option value="no_disponible">Solo no disponibles</option>
        </select>

        {hasActiveFilters && (
          <button type="button" className="ghostButton" onClick={() => setFilters(defaultFilters)}>
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="adminFilterCount">
        {filteredProperties.length} de {properties.length} propiedades
      </p>

      <div className="adminTable">
        <div className="adminTableHeader">
          <span>Propiedad</span>
          <span>Zona</span>
          <span>Operación</span>
          <span>Precio</span>
          <span>Specs</span>
          <span>Disponible</span>
          <span>Leads</span>
          <span>Acciones</span>
        </div>
        {properties.length === 0 && (
          <p className="adminEmpty">Aún no hay propiedades. Publica la primera para empezar.</p>
        )}
        {properties.length > 0 && filteredProperties.length === 0 && (
          <p className="adminEmpty">Ninguna propiedad coincide con estos filtros.</p>
        )}
        {filteredProperties.map((property) => (
          <div className="adminRow" key={property.id}>
            <div className="adminRowMain">
              <strong>{property.titulo}</strong>
              <span>{property.tipo}</span>
            </div>
            <span className="adminRowZone">{property.zona}</span>
            <span>{operationLabel(property.operacion)}</span>
            <b>
              {formatMoney(property.precio, property.moneda)}
              {priceSuffix(property.operacion)}
            </b>
            <span className="adminRowSpecs">
              {property.recamaras} rec · {property.banos} baños ·{" "}
              {property.superficieConstruida || property.superficieTerreno} m²
            </span>
            <span className={property.disponible ? "adminRowAvailable" : "adminRowUnavailable"}>
              {property.disponible ? "Sí" : "No"}
            </span>
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
    </>
  );
}
