"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { formatMoney } from "@/lib/format";
import { getOperationLabel, getPriceSuffix, getPropertyCopy } from "@/lib/i18n";
import type { PublicProperty } from "@/types/property";

type HeroCarouselProps = {
  properties: PublicProperty[];
};

export function HeroCarousel({ properties }: HeroCarouselProps) {
  const { language, t } = useI18n();
  const featured = useMemo(
    () =>
      [...properties]
        .filter((property) => property.destacado)
        .sort((first, second) => second.precio - first.precio)
        .slice(0, 4),
    [properties]
  );
  const [active, setActive] = useState(0);
  const current = featured[active] ?? properties[0];

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % featured.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [featured.length]);

  if (!current) return null;

  const currentCopy = getPropertyCopy(current, language);
  const goPrevious = () => setActive((value) => (value - 1 + featured.length) % featured.length);
  const goNext = () => setActive((value) => (value + 1) % featured.length);

  return (
    <section className="hero" aria-label={t.hero.aria}>
      <img className="heroImage" src={current.imagenes[0] ?? "/images/hero-property.png"} alt={currentCopy.titulo} />
      <div className="heroOverlay" />
      <div className="heroContent">
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <h1>{t.hero.title}</h1>
        <p className="heroCopy">{t.hero.copy}</p>
        <div className="heroActions">
          <a className="primaryButton" href="#propiedades">
            {t.hero.search}
          </a>
          <a className="secondaryButton" href="#contacto">
            {t.hero.call}
          </a>
        </div>
      </div>
      <aside className="featuredRail" aria-label={t.hero.featuredAria}>
        <div className="railTopline">
          <BadgeCheck size={18} />
          <span>
            {getOperationLabel(current.operacion, language)} {t.hero.featuredSuffix}
          </span>
        </div>
        <h2>{currentCopy.titulo}</h2>
        <p>
          <MapPin size={16} />
          {current.ubicacion.ciudad}, {current.ubicacion.estado}
        </p>
        <strong>
          {formatMoney(current.precio, current.moneda)}
          {getPriceSuffix(current.operacion, language)}
        </strong>
        <Link className="textLink" href={`/propiedades/${current.id}` as Route}>
          {t.hero.view}
        </Link>
        {featured.length > 1 ? (
          <div className="carouselControls">
            <button
              className="iconButton"
              type="button"
              onClick={goPrevious}
              title={t.hero.previous}
              aria-label={t.hero.previous}
            >
              <ArrowLeft size={18} />
            </button>
            <span>
              {active + 1}/{featured.length}
            </span>
            <button
              className="iconButton"
              type="button"
              onClick={goNext}
              title={t.hero.next}
              aria-label={t.hero.next}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
