"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Link2,
  MapPinned,
  Ruler
} from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { WhatsappLeadModal } from "@/components/WhatsappLeadModal";
import { formatMoney, mapEmbedUrl, mapUrl } from "@/lib/format";
import { getOperationLabel, getPriceSuffix, getPropertyCopy } from "@/lib/i18n";
import type { PublicProperty } from "@/types/property";

type PropertyDetailContentProps = {
  property: PublicProperty;
};

export function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  const { language, t } = useI18n();
  const copy = getPropertyCopy(property, language);
  const whatsappText = t.detail.whatsappText.replace("{title}", copy.titulo);
  const [linkCopied, setLinkCopied] = useState(false);
  const images = property.imagenes.length ? property.imagenes : ["/images/hero-property.png"];
  const [activeImage, setActiveImage] = useState(0);
  const goPrevious = () => setActiveImage((value) => (value - 1 + images.length) % images.length);
  const goNext = () => setActiveImage((value) => (value + 1) % images.length);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/propiedades/${property.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <main className="detailPage">
      <section className="detailHero">
        <div className="detailGallery">
          <img className="detailGalleryMain" src={images[activeImage]} alt={copy.titulo} />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="detailGalleryArrow detailGalleryPrev"
                onClick={goPrevious}
                aria-label={t.detail.previousPhoto}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="detailGalleryArrow detailGalleryNext"
                onClick={goNext}
                aria-label={t.detail.nextPhoto}
              >
                <ChevronRight size={22} />
              </button>
              <span className="detailGalleryCount">
                {activeImage + 1} / {images.length}
              </span>
              <div className="detailGalleryThumbs">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={index === activeImage ? "active" : undefined}
                    onClick={() => setActiveImage(index)}
                    aria-label={`${t.detail.photo} ${index + 1}`}
                    aria-current={index === activeImage}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
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
            <button type="button" className="secondaryButton" onClick={handleCopyLink}>
              {linkCopied ? <Check size={16} /> : <Link2 size={16} />}
              {linkCopied ? t.detail.linkCopied : t.detail.copyLink}
            </button>
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
