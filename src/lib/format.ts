import type { Operation, PublicProperty } from "@/types/property";

export function formatMoney(value: number, currency: PublicProperty["moneda"] = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function operationLabel(operation: Operation) {
  if (operation === "venta") return "Venta";
  if (operation === "renta_temporal") return "Renta temporal";
  return "Renta";
}

export function priceSuffix(operation: Operation) {
  return operation === "venta" ? "" : " / mes";
}

export function mapUrl(property: PublicProperty) {
  const { googleMapsUrl, direccion, ciudad, estado } = property.ubicacion;
  if (googleMapsUrl) return googleMapsUrl;
  const query = `${direccion}, ${ciudad}, ${estado}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

export function mapEmbedUrl(property: PublicProperty) {
  const { mapEmbedQuery, direccion, ciudad, estado } = property.ubicacion;
  const query = mapEmbedQuery || `${direccion}, ${ciudad}, ${estado}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
