import type { Operation, Property } from "@/types/property";

export function formatMoney(value: number, currency: Property["moneda"] = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function operationLabel(operation: Operation) {
  return operation === "venta" ? "Venta" : "Renta";
}

export function priceSuffix(operation: Operation) {
  return operation === "renta" ? " / mes" : "";
}

export function mapUrl(property: Property) {
  const { googleMapsUrl, direccion, ciudad, estado } = property.ubicacion;
  if (googleMapsUrl) return googleMapsUrl;
  const query = `${direccion}, ${ciudad}, ${estado}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

export function mapEmbedUrl(property: Property) {
  const { mapEmbedQuery, direccion, ciudad, estado } = property.ubicacion;
  const query = mapEmbedQuery || `${direccion}, ${ciudad}, ${estado}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
