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
  const { lat, lng, direccion, ciudad, estado } = property.ubicacion;
  const query = lat && lng ? `${lat},${lng}` : `${direccion}, ${ciudad}, ${estado}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}`;
}

export function mapEmbedUrl(property: Property) {
  return `${mapUrl(property)}&output=embed`;
}
