"use client";

import { BadgeCheck, Building2, GraduationCap, MapPin } from "lucide-react";
import { WhatsappLeadModal } from "@/components/WhatsappLeadModal";
import { siteConfig } from "@/lib/site";

const stats = [
  { value: "12+", label: "años de experiencia", icon: GraduationCap },
  { value: "300+", label: "propiedades cerradas", icon: Building2 },
  { value: "Boca del Río", label: "Veracruz · Alvarado", icon: MapPin }
];

const certifications = [
  {
    title: "AMPI",
    description: "Asociación Mexicana de Profesionales Inmobiliarios, sección Veracruz."
  },
  {
    title: "Cédula profesional",
    description: "Acreditación estatal vigente en Veracruz."
  },
  {
    title: "CIPS",
    description: "Certified International Property Specialist (NAR)."
  },
  {
    title: "Diplomado en Bienes Raíces",
    description: "Valuación, financiamiento y fideicomisos."
  }
];

const aboutWhatsappMessage = `Hola Mara, vi tu sitio y me gustaría conocerte para platicar sobre una propiedad.`;

export function AboutContent() {
  return (
    <main className="aboutPage">
      <section className="aboutHero">
        <div className="aboutHeroCopy">
          <p className="eyebrow">Sobre Mara Barquet</p>
          <h1>Asesoría inmobiliaria en Boca del Río, Veracruz</h1>
          <p>
            Mara acompaña a familias e inversionistas en la compra, venta y renta de propiedades
            en la zona conurbada de Veracruz, Boca del Río y Alvarado. Más de una década de
            experiencia local con ética profesional y seguimiento personal en cada operación.
          </p>
          <div className="aboutHeroActions">
            <WhatsappLeadModal
              prefilledMessage={aboutWhatsappMessage}
              triggerLabel="Agendar una llamada"
              leadContext="Sobre Mara"
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

      <section className="aboutStats" aria-label="Cifras de práctica">
        {stats.map(({ value, label, icon: Icon }) => (
          <article className="aboutStatCard" key={label}>
            <Icon size={18} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="aboutCertifications" aria-label="Certificaciones">
        <p className="eyebrow">Credenciales profesionales</p>
        <div className="aboutCertGrid">
          {certifications.map((cert) => (
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
