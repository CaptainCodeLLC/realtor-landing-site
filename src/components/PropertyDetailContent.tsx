"use client";

import Link from "next/link";
import { Bath, BedDouble, CalendarDays, Car, MapPinned, Ruler } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WhatsappLeadModal } from "@/components/WhatsappLeadModal";
import { formatMoney, mapEmbedUrl, mapUrl } from "@/lib/format";
import { getOperationLabel, getPriceSuffix, getPropertyCopy } from "@/lib/i18n";
import type { Property } from "@/types/property";

type PropertyDetailContentProps = {
  property: Property;
};

export function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  const { language, t } = useI18n();
  const copy = getPropertyCopy(property, language);
  const whatsappText = t.detail.whatsappText.replace("{title}", copy.titulo);

  return (
    <main className="detailPage">
      <section className="detailHero">
        <img src={property.imagenes[0] ?? "/images/hero-property.png"} alt={copy.titulo} />
        <div className="detailSummary">
          <p className="eyebrow">{getOperationLabel(property.operacion, language)}</p>
          <h1>{copy.titulo}</h1>
          <p className="locationLine">
            <MapPinned size={16} />
            {property.ubicacion.direccion}, {property.ubicacion.ciudad}, {property.ubicacion.estado}
          </p>
          <strong className="detailPrice">
            {formatMoney(property.precio, property.moneda)}
            {getPriceSuffix(property.operacion, language)}
          </strong>
          <div className="detailActions">
            <WhatsappLeadModal
              property={property}
              prefilledMessage={whatsappText}
              triggerLabel={t.detail.contact}
            />
            <a className="secondaryButton" href={mapUrl(property)} target="_blank" rel="noreferrer">
              {t.detail.map}
            </a>
          </div>
        </div>
      </section>

      <section className="detailContent">
        <div>
          <p className="eyebrow">{t.detail.descriptionEyebrow}</p>
          <h2>{t.detail.title}</h2>
          <p>{copy.descripcion}</p>
          <div className="detailSpecs">
            <span>
              <BedDouble size={18} />
              {property.recamaras} {t.detail.bedrooms}
            </span>
            <span>
              <Bath size={18} />
              {property.banos} {t.detail.baths}
            </span>
            <span>
              <Car size={18} />
              {property.estacionamientos} {t.detail.parking}
            </span>
            <span>
              <Ruler size={18} />
              {property.superficieConstruida || property.superficieTerreno} m²
            </span>
            <span>
              <CalendarDays size={18} />
              {property.anioConstruccion
                ? `${t.detail.builtYear} ${property.anioConstruccion}`
                : t.detail.yearPending}
            </span>
          </div>
          <div className="amenityList">
            {copy.amenidades.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
        </div>
        <div className="mapPanel">
          <iframe title={`${t.detail.mapTitle} ${copy.titulo}`} src={mapEmbedUrl(property)} loading="lazy" />
        </div>
      </section>

      <section className="backBand">
        <Link className="textLink" href="/#propiedades">
          {t.detail.back}
        </Link>
      </section>
    </main>
  );
}
