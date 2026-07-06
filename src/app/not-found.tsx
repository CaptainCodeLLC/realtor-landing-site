"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="notFoundPage">
      <p className="eyebrow">{t.notFound.eyebrow}</p>
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.copy}</p>
      <Link className="primaryButton" href="/#propiedades">
        {t.notFound.action}
      </Link>
    </main>
  );
}
