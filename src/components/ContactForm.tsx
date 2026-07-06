"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { getPropertyTypeLabel } from "@/lib/i18n";
import type { Operation, PropertyType } from "@/types/property";
import { propertyTypes } from "@/types/property";
import { siteConfig } from "@/lib/site";

type ContactFormState = {
  nombre: string;
  telefono: string;
  email: string;
  mudanza: string;
  operacion: Operation;
  tipo: PropertyType;
  presupuesto: string;
  mensaje: string;
};

const initialState: ContactFormState = {
  nombre: "",
  telefono: "",
  email: "",
  mudanza: "",
  operacion: "venta",
  tipo: "Casa unifamiliar",
  presupuesto: "",
  mensaje: ""
};

type ContactFormProps = {
  propertyId?: string;
};

export function ContactForm({ propertyId }: ContactFormProps = {}) {
  const { language, t } = useI18n();
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState("");

  const whatsappMessage = useMemo(() => {
    return [
      `${t.contact.whatsappIntro} ${form.nombre || t.contact.whatsappFallbackName}.`,
      `${t.contact.whatsappPhone}: ${form.telefono || t.contact.whatsappPending}.`,
      `${t.contact.whatsappLookingFor}: ${form.operacion === "venta" ? t.contact.whatsappBuy : t.contact.whatsappRent}.`,
      `${t.contact.whatsappType}: ${getPropertyTypeLabel(form.tipo, language)}.`,
      `${t.contact.whatsappMoveDate}: ${form.mudanza || t.contact.whatsappToDefine}.`,
      `${t.contact.whatsappBudget}: ${form.presupuesto || t.contact.whatsappToDefine}.`,
      form.mensaje ? `${t.contact.whatsappMessage}: ${form.mensaje}` : ""
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, language, t]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t.contact.sending);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, propertyId })
    });

    if (!response.ok) {
      setStatus(t.contact.error);
      return;
    }

    setStatus(t.contact.success);
    window.open(`https://wa.me/${siteConfig.phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    setForm(initialState);
  }

  return (
    <section className="contactSection" id="contacto">
      <div className="contactIntro">
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2>{t.contact.title}</h2>
        <p>{t.contact.copy}</p>
      </div>

      <form className="contactForm" onSubmit={handleSubmit}>
        <label>
          {t.contact.name}
          <input
            required
            value={form.nombre}
            onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
            placeholder={t.contact.namePlaceholder}
          />
        </label>
        <label>
          {t.contact.phone}
          <input
            required
            type="tel"
            value={form.telefono}
            onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))}
            placeholder="+52 ..."
          />
        </label>
        <label>
          {t.contact.email}
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder={t.contact.emailPlaceholder}
          />
        </label>
        <label>
          {t.contact.moveDate}
          <input
            required
            value={form.mudanza}
            onChange={(event) => setForm((current) => ({ ...current, mudanza: event.target.value }))}
            placeholder={t.contact.moveDatePlaceholder}
          />
        </label>
        <label>
          {t.contact.lookingFor}
          <select
            value={form.operacion}
            onChange={(event) => setForm((current) => ({ ...current, operacion: event.target.value as Operation }))}
          >
            <option value="venta">{t.contact.buy}</option>
            <option value="renta">{t.contact.rent}</option>
          </select>
        </label>
        <label>
          {t.contact.propertyType}
          <select
            value={form.tipo}
            onChange={(event) => setForm((current) => ({ ...current, tipo: event.target.value as PropertyType }))}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {getPropertyTypeLabel(type, language)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.contact.budget}
          <input
            value={form.presupuesto}
            onChange={(event) => setForm((current) => ({ ...current, presupuesto: event.target.value }))}
            placeholder={t.contact.budgetPlaceholder}
          />
        </label>
        <label className="fullField">
          {t.contact.message}
          <textarea
            value={form.mensaje}
            onChange={(event) => setForm((current) => ({ ...current, mensaje: event.target.value }))}
            placeholder={t.contact.messagePlaceholder}
          />
        </label>
        <button className="primaryButton formButton" type="submit">
          <Send size={18} />
          {t.contact.submit}
        </button>
        <p className="formStatus" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}
