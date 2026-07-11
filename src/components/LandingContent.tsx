"use client";

import { ContactForm } from "@/components/ContactForm";
import { HeroCarousel } from "@/components/HeroCarousel";
import { useI18n } from "@/components/I18nProvider";
import { PropertyExplorer } from "@/components/PropertyExplorer";
import type { PublicProperty } from "@/types/property";

type LandingContentProps = {
  properties: PublicProperty[];
};

export function LandingContent({ properties }: LandingContentProps) {
  const { t } = useI18n();
  const sales = properties.filter((property) => property.operacion === "venta").length;
  const rentals = properties.filter((property) => property.operacion !== "venta").length;

  return (
    <main>
      <HeroCarousel properties={properties} />
      <section className="statsBand" aria-label={t.stats.aria}>
        <div>
          <strong>{sales}</strong>
          <span>{t.stats.sales}</span>
        </div>
        <div>
          <strong>{rentals}</strong>
          <span>{t.stats.rentals}</span>
        </div>
        <div>
          <strong>{t.stats.whatsapp}</strong>
          <span>{t.stats.whatsappLabel}</span>
        </div>
        <div>
          <strong>{t.stats.inventory}</strong>
          <span>{t.stats.inventoryLabel}</span>
        </div>
      </section>
      <PropertyExplorer properties={properties} />
      <section className="futureBand" aria-label={t.homeSupport.aria}>
        <div>
          <p className="eyebrow">{t.homeSupport.eyebrow}</p>
          <h2>{t.homeSupport.title}</h2>
        </div>
        <p>{t.homeSupport.copy}</p>
      </section>
      <ContactForm />
    </main>
  );
}
