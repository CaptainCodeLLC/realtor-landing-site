export type Operation = "venta" | "renta";

export type PropertyType =
  | "Casa unifamiliar"
  | "Departamento"
  | "Villa"
  | "Oficina"
  | "Bodega"
  | "Local comercial"
  | "Restaurante"
  | "Edificio"
  | "Terreno";

export type Zone = "Boca del Rio" | "Alvarado" | "Veracruz";

export type PropertyLocation = {
  direccion: string;
  ciudad: string;
  estado: string;
  lat: number;
  lng: number;
};

export type Property = {
  id: string;
  titulo: string;
  operacion: Operation;
  tipo: PropertyType;
  zona: Zone;
  precio: number;
  moneda: "MXN" | "USD";
  ubicacion: PropertyLocation;
  recamaras: number;
  banos: number;
  estacionamientos: number;
  superficieConstruida: number;
  superficieTerreno: number;
  anioConstruccion: number;
  descripcion: string;
  amenidades: string[];
  imagenes: string[];
  destacado: boolean;
  vistas: number;
  createdAt: string;
};

export type Lead = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  mudanza: string;
  operacion: Operation;
  tipo: PropertyType;
  presupuesto: string;
  mensaje: string;
  propertyId?: string;
  createdAt: string;
};

export const propertyTypes: PropertyType[] = [
  "Casa unifamiliar",
  "Departamento",
  "Villa",
  "Oficina",
  "Bodega",
  "Local comercial",
  "Restaurante",
  "Edificio",
  "Terreno"
];

export const zones: Zone[] = ["Boca del Rio", "Alvarado", "Veracruz"];

export function isZone(value: unknown): value is Zone {
  return typeof value === "string" && (zones as string[]).includes(value);
}
