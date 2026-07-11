"use client";

import Link from "next/link";
import type { Route } from "next";
import { BriefcaseBusiness, Camera, Phone, Users } from "lucide-react";
import { LanguageToggle, useI18n } from "@/components/I18nProvider";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  background?: "light" | "dark";
};

export function Logo({ background = "light" }: LogoProps) {
  const src = background === "dark" ? "/images/logo-blanco.png" : "/images/logo-negro.png";

  return (
    <Link className="logo" href="/" aria-label="Ir al inicio">
      <img src={src} alt="Mara Barquet Realtor" className="logoImage" />
    </Link>
  );
}

export function Header() {
  const { t } = useI18n();

  return (
    <header className="siteHeader">
      <Logo />
      <nav className="mainNav" aria-label="Navegación principal">
        <a href="/#propiedades">{t.nav.properties}</a>
        <Link href={"/about" as Route}>{t.nav.about}</Link>
        <a href="/#contacto">{t.nav.contact}</a>
      </nav>
      <div className="headerActions">
        <a className="iconButton" href={siteConfig.instagram} title="Instagram" aria-label="Instagram">
          <Camera size={18} />
        </a>
        <a className="iconButton" href={siteConfig.facebook} title="Facebook" aria-label="Facebook">
          <Users size={18} />
        </a>
        <a className="iconButton" href={siteConfig.linkedin} title="LinkedIn" aria-label="LinkedIn">
          <BriefcaseBusiness size={18} />
        </a>
        <a className="phoneButton" href={`tel:${siteConfig.phoneDigits}`}>
          <Phone size={18} />
          <span>{siteConfig.phoneLabel}</span>
        </a>
        <LanguageToggle />
      </div>
    </header>
  );
}
