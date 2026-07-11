export type Operation = "venta" | "renta" | "renta_temporal";

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

export type PropertyLocation = {
  direccion: string;
  ciudad: string;
  estado: string;
  googleMapsUrl: string;
  mapEmbedQuery: string;
};

export type PropertyOwnerContact = {
  nombre: string;
  telefono: string;
  correo: string;
};

export type Property = {
  id: string;
  titulo: string;
  operacion: Operation;
  tipo: PropertyType;
  zona: string;
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
  disponible: boolean;
  contactoPropietario: PropertyOwnerContact;
  vistas: number;
  createdAt: string;
};

/** Property with internal-only fields stripped — the only shape ever sent to public pages/APIs. */
export type PublicProperty = Omit<Property, "contactoPropietario">;

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
