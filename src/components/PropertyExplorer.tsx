"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Bath, BedDouble, Building2, Car, MapPinned, Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { formatMoney, mapUrl } from "@/lib/format";
import { getOperationLabel, getPriceSuffix, getPropertyCopy, getPropertyTypeLabel } from "@/lib/i18n";
import type { Operation, PropertyType, PublicProperty } from "@/types/property";
import { propertyTypes } from "@/types/property";

type PropertyExplorerProps = {
  properties: PublicProperty[];
};

type Filters = {
  operacion: Operation | "todas";
  tipo: PropertyType | "todos";
  recamaras: number;
  banos: number;
  precioMaximo: number;
  busqueda: string;
};

const defaultFilters: Filters = {
  operacion: "todas",
  tipo: "todos",
  recamaras: 0,
  banos: 0,
  precioMaximo: 0,
  busqueda: ""
};

export function PropertyExplorer({ properties }: PropertyExplorerProps) {
  const { language, t } = useI18n();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const search = filters.busqueda.trim().toLowerCase();
      const copy = getPropertyCopy(property, language);
      const matchesSearch =
        !search ||
        [
          property.titulo,
          property.tipo,
          property.ubicacion.ciudad,
          property.ubicacion.estado,
          property.descripcion,
          copy.titulo,
          copy.tipo,
          copy.descripcion
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesOperation =
        filters.operacion === "todas" ||
        property.operacion === filters.operacion ||
        (filters.operacion === "renta" && property.operacion === "renta_temporal");

      return (
        matchesOperation &&
        (filters.tipo === "todos" || property.tipo === filters.tipo) &&
        property.recamaras >= filters.recamaras &&
        property.banos >= filters.banos &&
        (!filters.precioMaximo || property.precio <= filters.precioMaximo) &&
        matchesSearch
      );
    });
  }, [filters, language, properties]);

  return (
    <section className="propertySection" id="propiedades">
      <div className="sectionIntro">
        <p className="eyebrow">{t.explorer.eyebrow}</p>
        <h2>{t.explorer.title}</h2>
        <p>{t.explorer.copy}</p>
      </div>

      <div className="searchSurface" aria-label={t.explorer.searchAria}>
        <div className="segmentedControl" aria-label={t.explorer.operationAria}>
          {(["todas", "venta", "renta"] as const).map((operation) => (
            <button
              key={operation}
              type="button"
              className={filters.operacion === operation ? "isActive" : ""}
              onClick={() => setFilters((current) => ({ ...current, operacion: operation }))}
            >
              {operation === "todas" ? t.explorer.all : getOperationLabel(operation, language)}
            </button>
          ))}
        </div>

        <label className="searchField wideField">
          <Search size={18} />
          <span>{t.explorer.search}</span>
          <input
            value={filters.busqueda}
            onChange={(event) => setFilters((current) => ({ ...current, busqueda: event.target.value }))}
            placeholder={t.explorer.searchPlaceholder}
          />
        </label>

        <label className="searchField">
          <Building2 size={18} />
          <span>{t.explorer.type}</span>
          <select
            value={filters.tipo}
            onChange={(event) => setFilters((current) => ({ ...current, tipo: event.target.value as Filters["tipo"] }))}
          >
            <option value="todos">{t.explorer.allTypes}</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {getPropertyTypeLabel(type, language)}
              </option>
            ))}
          </select>
        </label>

        <label className="searchField">
          <BedDouble size={18} />
          <span>{t.explorer.bedrooms}</span>
          <input
            type="number"
            min="0"
            value={filters.recamaras}
            onChange={(event) => setFilters((current) => ({ ...current, recamaras: Number(event.target.value) }))}
          />
        </label>

        <label className="searchField">
          <Bath size={18} />
          <span>{t.explorer.baths}</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={filters.banos}
            onChange={(event) => setFilters((current) => ({ ...current, banos: Number(event.target.value) }))}
          />
        </label>

        <label className="searchField">
          <SlidersHorizontal size={18} />
          <span>{t.explorer.maxPrice}</span>
          <input
            type="number"
            min="0"
            value={filters.precioMaximo}
            onChange={(event) => setFilters((current) => ({ ...current, precioMaximo: Number(event.target.value) }))}
            placeholder={t.explorer.noLimit}
          />
        </label>
      </div>

      <div className="resultBar">
        <strong>{filteredProperties.length}</strong>
        <span>{filteredProperties.length === 1 ? t.explorer.resultSingular : t.explorer.resultPlural}</span>
      </div>

      <div className="propertyGrid">
        {filteredProperties.map((property) => {
          const copy = getPropertyCopy(property, language);

          return (
            <article className="propertyCard" key={property.id}>
              <div className="propertyMedia">
                <img src={property.imagenes[0] ?? "/images/hero-property.png"} alt={copy.titulo} />
                <span className={property.operacion === "renta_temporal" ? "badgeShortTerm" : ""}>
                  {getOperationLabel(property.operacion, language)}
                </span>
              </div>
              <div className="propertyBody">
                <div className="propertyTitleRow">
                  <h3>{copy.titulo}</h3>
                  <strong>
                    {formatMoney(property.precio, property.moneda)}
                    {getPriceSuffix(property.operacion, language)}
                  </strong>
                </div>
                <p className="locationLine">
                  <MapPinned size={16} />
                  {property.ubicacion.ciudad}, {property.ubicacion.estado}
                </p>
                <p>{copy.descripcion}</p>
                <div className="propertySpecs" aria-label={t.explorer.specsAria}>
                  <span>
                    <BedDouble size={16} />
                    {property.recamaras} {t.explorer.bedroomShort}
                  </span>
                  <span>
                    <Bath size={16} />
                    {property.banos} {t.explorer.bathLabel}
                  </span>
                  <span>
                    <Car size={16} />
                    {property.estacionamientos} {t.explorer.parkingShort}
                  </span>
                  <span>{property.superficieConstruida || property.superficieTerreno} m²</span>
                </div>
                <div className="propertyActions">
                  <Link className="primaryButton smallButton" href={`/propiedades/${property.id}` as Route}>
                    {t.explorer.details}
                  </Link>
                  <a className="secondaryButton smallButton" href={mapUrl(property)} target="_blank" rel="noreferrer">
                    {t.explorer.map}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
