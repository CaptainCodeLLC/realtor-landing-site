"use client";

import { BadgeCheck, Building2, GraduationCap, MapPin } from "lucide-react";
import { WhatsappLeadModal } from "@/components/WhatsappLeadModal";
import { useI18n } from "@/components/I18nProvider";
import { siteConfig } from "@/lib/site";

const statIcons = [GraduationCap, Building2, MapPin] as const;

export function AboutContent() {
  const { t } = useI18n();

  return (
    <main className="aboutPage">
      <section className="aboutHero">
        <div className="aboutHeroCopy">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h1>{t.about.title}</h1>
          <p>{t.about.copy}</p>
          <div className="aboutHeroActions">
            <WhatsappLeadModal
              prefilledMessage={t.about.whatsappMessage}
              triggerLabel={t.about.call}
              leadContext={t.about.leadContext}
            />
            <a className="secondaryButton" href={`tel:${siteConfig.phoneDigits}`}>
              {siteConfig.phoneLabel}
            </a>
          </div>
        </div>
        <div className="aboutHeroPortrait" aria-hidden="true">
          <div className="aboutPortraitPlaceholder">
            <span>MB</span>
          </div>
        </div>
      </section>

      <section className="aboutStats" aria-label={t.about.statsAria}>
        {t.about.stats.map(({ value, label }, index) => {
          const Icon = statIcons[index] ?? GraduationCap;

          return (
            <article className="aboutStatCard" key={label}>
              <Icon size={18} />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          );
        })}
      </section>

      <section className="aboutCertifications" aria-label={t.about.certificationsAria}>
        <p className="eyebrow">{t.about.certificationsEyebrow}</p>
        <div className="aboutCertGrid">
          {t.about.certifications.map((cert) => (
            <article className="aboutCertCard" key={cert.title}>
              <BadgeCheck size={18} />
              <h3>{cert.title}</h3>
              <p>{cert.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
