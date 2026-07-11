"use client";

import { Logo } from "@/components/Header";
import { useI18n } from "@/components/I18nProvider";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="siteFooter">
      <div>
        <Logo background="dark" />
        <p>{siteConfig.address}</p>
      </div>
      <div>
        <strong>{t.footer.privacy}</strong>
        <p>
          {t.footer.privacyCopy} {siteConfig.privacyEmail}.
        </p>
      </div>
      <div>
        <strong>{t.footer.contact}</strong>
        <p>{siteConfig.phoneLabel}</p>
        <p>{siteConfig.email}</p>
      </div>
    </footer>
  );
}
