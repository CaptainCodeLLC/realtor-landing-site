"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { UploadCloud, X } from "lucide-react";
import type { Operation, Property, PropertyType, Zone } from "@/types/property";
import { propertyTypes, zones } from "@/types/property";

type Status = {
  message: string;
  tone: "neutral" | "success" | "error";
};

type AdminListingFormProps = {
  mode: "create" | "edit";
  initial?: Property;
};

type LocalPhoto = { id: string; file: File; previewUrl: string };

const defaultStatus = (mode: "create" | "edit"): Status => ({
  message:
    mode === "create"
      ? "Completa el formulario para publicar una propiedad nueva."
      : "Actualiza los campos que necesitas y guarda los cambios.",
  tone: "neutral"
});

export function AdminListingForm({ mode, initial }: AdminListingFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(defaultStatus(mode));
  const [existingImages, setExistingImages] = useState<string[]>(initial?.imagenes ?? []);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const localPhotosRef = useRef<LocalPhoto[]>([]);

  useEffect(() => {
    localPhotosRef.current = localPhotos;
  }, [localPhotos]);

  useEffect(() => {
    return () => {
      localPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const submitLabel = useMemo(
    () => (mode === "create" ? "Publicar propiedad" : "Guardar cambios"),
    [mode]
  );

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setLocalPhotos((current) => [...current, ...next]);
    event.target.value = "";
  }

  function removeLocalPhoto(id: string) {
    setLocalPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function removeExistingImage(image: string) {
    setExistingImages((current) => current.filter((item) => item !== image));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.delete("imagenes");
    for (const photo of localPhotos) {
      formData.append("imagenes", photo.file);
    }
    formData.set("existingImages", JSON.stringify(existingImages));

    setSubmitting(true);
    setStatus({ message: mode === "create" ? "Guardando propiedad..." : "Guardando cambios...", tone: "neutral" });

    const endpoint = mode === "create" ? "/api/properties" : `/api/properties/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, { method, body: formData });

    if (response.status === 401) {
      setSubmitting(false);
      setStatus({ message: "Tu sesión expiró. Vuelve a entrar para continuar.", tone: "error" });
      return;
    }

    if (!response.ok) {
      setSubmitting(false);
      const payload = await response.json().catch(() => null);
      setStatus({
        message: payload?.message ?? "No se pudo guardar. Revisa los campos e intenta de nuevo.",
        tone: "error"
      });
      return;
    }

    const saved = (await response.json()) as Property;
    setSubmitting(false);
    setStatus({
      message:
        mode === "create"
          ? "Propiedad publicada. Redirigiendo..."
          : "Cambios guardados. Redirigiendo...",
      tone: "success"
    });
    router.push(`/admin/properties/${saved.id}` as Route);
    router.refresh();
  }

  return (
    <form className="adminForm" onSubmit={handleSubmit}>
      <p className="formHint">
        Los campos marcados con <span className="requiredMark">*</span> son obligatorios.
      </p>
      <div className="adminGrid">
        <label>
          Título de la propiedad <span className="requiredMark">*</span>
          <input name="titulo" required defaultValue={initial?.titulo} placeholder="Casa en Boca del Río" />
        </label>
        <label>
          Operación
          <select name="operacion" defaultValue={initial?.operacion ?? ("venta" satisfies Operation)}>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
          </select>
        </label>
        <label>
          Tipo
          <select name="tipo" defaultValue={initial?.tipo ?? ("Casa unifamiliar" satisfies PropertyType)}>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Zona <span className="requiredMark">*</span>
          <select name="zona" defaultValue={initial?.zona ?? ("Veracruz" satisfies Zone)} required>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
        <label>
          Precio <span className="requiredMark">*</span>
          <input name="precio" required type="number" min="0" defaultValue={initial?.precio} placeholder="8500000" />
        </label>
        <label>
          Moneda
          <select name="moneda" defaultValue={initial?.moneda ?? "MXN"}>
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label>
          Ciudad <span className="requiredMark">*</span>
          <input name="ciudad" required defaultValue={initial?.ubicacion.ciudad} placeholder="Veracruz" />
        </label>
        <label>
          Estado <span className="requiredMark">*</span>
          <input name="estado" required defaultValue={initial?.ubicacion.estado} placeholder="Veracruz" />
        </label>
        <label className="wideAdminField">
          Dirección o colonia <span className="requiredMark">*</span>
          <input
            name="direccion"
            required
            defaultValue={initial?.ubicacion.direccion}
            placeholder="Colonia, avenida o referencia"
          />
        </label>
        <label className="wideAdminField">
          Enlace de Google Maps
          <input
            name="googleMapsUrl"
            type="url"
            defaultValue={initial?.ubicacion.googleMapsUrl}
            placeholder="https://maps.app.goo.gl/xxxxx"
          />
        </label>
        <label>
          Recámaras
          <input name="recamaras" type="number" min="0" defaultValue={initial?.recamaras ?? 0} />
        </label>
        <label>
          Baños
          <input name="banos" type="number" min="0" step="0.5" defaultValue={initial?.banos ?? 0} />
        </label>
        <label>
          Estacionamientos
          <input name="estacionamientos" type="number" min="0" defaultValue={initial?.estacionamientos ?? 0} />
        </label>
        <label>
          m² construidos
          <input
            name="superficieConstruida"
            type="number"
            min="0"
            defaultValue={initial?.superficieConstruida ?? 0}
          />
        </label>
        <label>
          m² de terreno
          <input name="superficieTerreno" type="number" min="0" defaultValue={initial?.superficieTerreno ?? 0} />
        </label>
        <label>
          Año de construcción
          <input
            name="anioConstruccion"
            type="number"
            min="0"
            defaultValue={initial?.anioConstruccion}
            placeholder="2024"
          />
        </label>
        <label className="wideAdminField">
          Amenidades
          <input
            name="amenidades"
            defaultValue={initial?.amenidades.join(", ")}
            placeholder="Alberca, terraza, vigilancia"
          />
        </label>
        <div className="wideAdminField photoField">
          <span className="photoFieldLabel">Fotografías</span>
          {(existingImages.length > 0 || localPhotos.length > 0) && (
            <div className="photoGrid">
              {existingImages.map((image) => (
                <div className="photoThumb" key={image}>
                  <img src={image} alt="Imagen actual" />
                  <button
                    type="button"
                    className="photoRemove"
                    onClick={() => removeExistingImage(image)}
                    aria-label="Quitar imagen"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {localPhotos.map((photo) => (
                <div className="photoThumb" key={photo.id}>
                  <img src={photo.previewUrl} alt="Imagen nueva" />
                  <span className="photoBadge">Nueva</span>
                  <button
                    type="button"
                    className="photoRemove"
                    onClick={() => removeLocalPhoto(photo.id)}
                    aria-label="Quitar imagen"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="fileInput">
            <UploadCloud size={18} />
            <span>Agregar fotografías</span>
            <input type="file" accept="image/*" multiple onChange={handleFilesSelected} />
          </label>
        </div>
        <label className="wideAdminField">
          Descripción <span className="requiredMark">*</span>
          <textarea
            name="descripcion"
            required
            defaultValue={initial?.descripcion}
            placeholder="Describe la propiedad con información clara para compradores o arrendatarios."
          />
        </label>
        <label className="checkboxField">
          <input name="destacado" type="checkbox" defaultChecked={initial?.destacado ?? false} />
          Mostrar como propiedad destacada
        </label>
      </div>
      <button className="primaryButton formButton" type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : submitLabel}
      </button>
      <p className={`formStatus ${status.tone}`} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
