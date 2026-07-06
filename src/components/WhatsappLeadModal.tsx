"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import type { Property } from "@/types/property";

type WhatsappLeadModalProps = {
  property?: Property;
  prefilledMessage: string;
  triggerLabel: string;
  triggerClassName?: string;
  leadContext?: string;
};

export function WhatsappLeadModal({
  property,
  prefilledMessage,
  triggerLabel,
  triggerClassName,
  leadContext
}: WhatsappLeadModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleClose() {
    if (submitting) return;
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Tu nombre y teléfono son obligatorios.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const message = property
      ? `WhatsApp · ${property.titulo}`
      : `WhatsApp · ${leadContext ?? "Contacto general"}`;

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        operacion: property?.operacion ?? "venta",
        tipo: property?.tipo ?? "Casa unifamiliar",
        mudanza: "",
        presupuesto: "",
        mensaje: message,
        propertyId: property?.id
      })
    });

    setSubmitting(false);

    if (!response.ok) {
      setError("No pudimos guardar tu solicitud. Intenta de nuevo.");
      return;
    }

    const url = `https://wa.me/${siteConfig.phoneDigits}?text=${encodeURIComponent(prefilledMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    setForm({ nombre: "", telefono: "", email: "" });
  }

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? "primaryButton"}
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={16} />
        {triggerLabel}
      </button>
      {open && (
        <div className="modalOverlay" role="presentation" onClick={handleClose}>
          <div
            className="modalCard"
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-modal-title"
            ref={dialogRef}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modalClose" onClick={handleClose} aria-label="Cerrar">
              <X size={18} />
            </button>
            <p className="eyebrow">Contacto por WhatsApp</p>
            <h2 id="whatsapp-modal-title">Déjanos tus datos antes de continuar</h2>
            <p className="modalCopy">
              Guardamos tu nombre y teléfono para darle seguimiento aunque no envíes el mensaje en WhatsApp.
              Después abrimos la conversación con la información de la propiedad.
            </p>
            <form className="modalForm" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input
                  ref={firstFieldRef}
                  required
                  value={form.nombre}
                  onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                  placeholder="Tu nombre"
                />
              </label>
              <label>
                Teléfono
                <input
                  required
                  type="tel"
                  value={form.telefono}
                  onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))}
                  placeholder="+52 ..."
                />
              </label>
              <label>
                Correo (opcional)
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="tucorreo@ejemplo.com"
                />
              </label>
              {error && (
                <p className="formStatus error" role="alert">
                  {error}
                </p>
              )}
              <button className="primaryButton formButton" type="submit" disabled={submitting}>
                <MessageCircle size={16} />
                {submitting ? "Guardando..." : "Abrir WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
