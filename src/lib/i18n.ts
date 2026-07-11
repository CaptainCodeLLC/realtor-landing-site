import type { Operation, PropertyType, PublicProperty } from "@/types/property";

export const languages = ["es", "en"] as const;

export type Language = (typeof languages)[number];

type PropertyTranslation = {
  readonly titulo: string;
  readonly descripcion: string;
  readonly amenidades: readonly string[];
};

export const translations = {
  es: {
    language: {
      current: "Español",
      switchTo: "English",
      toggleLabel: "Cambiar idioma a inglés"
    },
    nav: {
      properties: "Propiedades",
      about: "Sobre Mara",
      contact: "Contacto"
    },
    hero: {
      aria: "Propiedades destacadas",
      eyebrow: "Asesoría inmobiliaria en español",
      title: "Mara Barquet Realtor",
      copy: "Propiedades en venta y renta en Veracruz con atención directa, filtros claros y seguimiento rápido por WhatsApp.",
      search: "Buscar propiedades",
      call: "Agendar llamada",
      featuredAria: "Propiedad de mayor valor",
      featuredSuffix: "destacada",
      view: "Ver propiedad",
      previous: "Anterior",
      next: "Siguiente"
    },
    stats: {
      aria: "Resumen de inventario",
      sales: "en venta",
      rentals: "en renta",
      whatsapp: "WhatsApp",
      whatsappLabel: "respuesta directa",
      inventory: "Inventario",
      inventoryLabel: "actualizado"
    },
    homeSupport: {
      aria: "Seguimiento inmobiliario",
      eyebrow: "Acompañamiento claro",
      title: "Seguimiento directo para comprar, vender o rentar con confianza",
      copy: "Cada solicitud llega con la información necesaria para dar una respuesta útil: fecha de mudanza, tipo de propiedad, operación, presupuesto y teléfono de contacto."
    },
    about: {
      eyebrow: "Sobre Mara Barquet",
      title: "Asesoría inmobiliaria en Boca del Río, Veracruz",
      copy:
        "Mara acompaña a familias e inversionistas en la compra, venta y renta de propiedades en la zona conurbada de Veracruz, Boca del Río y Alvarado. Más de una década de experiencia local con ética profesional y seguimiento personal en cada operación.",
      call: "Agendar una llamada",
      leadContext: "Sobre Mara",
      whatsappMessage:
        "Hola Mara, vi tu sitio y me gustaría conocerte para platicar sobre una propiedad.",
      statsAria: "Cifras de práctica",
      stats: [
        { value: "12+", label: "años de experiencia" },
        { value: "300+", label: "propiedades cerradas" },
        { value: "Boca del Río", label: "Veracruz · Alvarado" }
      ],
      certificationsAria: "Certificaciones",
      certificationsEyebrow: "Credenciales profesionales",
      certifications: [
        {
          title: "AMPI",
          description: "Asociación Mexicana de Profesionales Inmobiliarios, sección Veracruz."
        },
        {
          title: "Cédula profesional",
          description: "Acreditación estatal vigente en Veracruz."
        },
        {
          title: "CIPS",
          description: "Certified International Property Specialist (NAR)."
        },
        {
          title: "Diplomado en Bienes Raíces",
          description: "Valuación, financiamiento y fideicomisos."
        }
      ]
    },
    explorer: {
      eyebrow: "Inventario activo",
      title: "Busca en tiempo real por venta, renta y características",
      copy: "El listado se actualiza mientras eliges recámaras, baños, presupuesto, tipo de inmueble o ubicación.",
      searchAria: "Búsqueda de propiedades",
      operationAria: "Operación",
      all: "Todas",
      search: "Buscar",
      searchPlaceholder: "Ciudad, zona o palabra clave",
      type: "Tipo",
      allTypes: "Todos",
      bedrooms: "Recámaras",
      baths: "Baños",
      maxPrice: "Precio máximo",
      noLimit: "Sin límite",
      resultSingular: "propiedad disponible",
      resultPlural: "propiedades disponibles",
      specsAria: "Especificaciones",
      bedroomShort: "rec.",
      bathLabel: "baños",
      parkingShort: "est.",
      details: "Ver detalles",
      map: "Mapa"
    },
    contact: {
      eyebrow: "Contacto directo",
      title: "Cuéntanos qué necesitas y te respondemos por WhatsApp",
      copy: "La solicitud incluye tu teléfono para que Mara pueda responderte con contexto y dar seguimiento sin fricción.",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      phone: "Teléfono",
      email: "Correo",
      emailPlaceholder: "correo@ejemplo.com",
      moveDate: "¿Cuándo buscas mudarte?",
      moveDatePlaceholder: "Fecha, temporada o trabajo estacional",
      lookingFor: "¿Qué estás buscando?",
      buy: "Comprar",
      rent: "Rentar",
      propertyType: "Tipo de propiedad",
      budget: "Presupuesto",
      budgetPlaceholder: "Rango aproximado",
      message: "Mensaje",
      messagePlaceholder: "Zona ideal, necesidades especiales o dudas",
      submit: "Enviar por WhatsApp",
      sending: "Enviando solicitud...",
      error: "No se pudo guardar la solicitud. Intenta de nuevo.",
      success: "Solicitud guardada. Se abrirá WhatsApp con tu mensaje.",
      whatsappIntro: "Hola Mara, soy",
      whatsappFallbackName: "un cliente",
      whatsappPhone: "Teléfono para responder",
      whatsappPending: "pendiente",
      whatsappLookingFor: "Busco",
      whatsappBuy: "comprar",
      whatsappRent: "rentar",
      whatsappType: "Tipo de propiedad",
      whatsappMoveDate: "Fecha o temporada de mudanza",
      whatsappToDefine: "por definir",
      whatsappBudget: "Presupuesto",
      whatsappMessage: "Mensaje"
    },
    footer: {
      privacy: "Aviso de privacidad",
      privacyCopy:
        "Los datos enviados por formularios se usan únicamente para atender solicitudes inmobiliarias. Para ejercer derechos de acceso, rectificación o cancelación escribe a",
      contact: "Contacto"
    },
    detail: {
      contact: "Contactar por WhatsApp",
      map: "Abrir mapa",
      descriptionEyebrow: "Descripción",
      title: "Detalles de la propiedad",
      bedrooms: "recámaras",
      baths: "baños",
      parking: "estacionamientos",
      builtYear: "Construida en",
      yearPending: "Año por confirmar",
      back: "Volver a propiedades",
      mapTitle: "Mapa de",
      whatsappText: "Hola Mara, me interesa {title}. ¿Me puedes compartir más información?",
      copyLink: "Copiar enlace",
      linkCopied: "¡Enlace copiado!"
    },
    notFound: {
      eyebrow: "No encontrada",
      title: "La propiedad no está disponible",
      copy: "Puede haber sido reservada, vendida o retirada del inventario público.",
      action: "Ver propiedades"
    },
    operations: {
      venta: "Venta",
      renta: "Renta",
      renta_temporal: "Renta temporal"
    },
    priceSuffix: {
      renta: " / mes",
      renta_temporal: " / mes",
      venta: ""
    },
    propertyTypes: {
      "Casa unifamiliar": "Casa unifamiliar",
      Departamento: "Departamento",
      Villa: "Villa",
      Oficina: "Oficina",
      Bodega: "Bodega",
      "Local comercial": "Local comercial",
      Restaurante: "Restaurante",
      Edificio: "Edificio",
      Terreno: "Terreno"
    },
    properties: {}
  },
  en: {
    language: {
      current: "English",
      switchTo: "Español",
      toggleLabel: "Switch language to Spanish"
    },
    nav: {
      properties: "Properties",
      about: "About Mara",
      contact: "Contact"
    },
    hero: {
      aria: "Featured properties",
      eyebrow: "Real estate guidance for international investors",
      title: "Mara Barquet Realtor",
      copy: "Homes, rentals, and commercial opportunities in Veracruz with clear filters, direct support, and fast WhatsApp follow-up.",
      search: "Search properties",
      call: "Schedule a call",
      featuredAria: "Highest-value property",
      featuredSuffix: "featured",
      view: "View property",
      previous: "Previous",
      next: "Next"
    },
    stats: {
      aria: "Inventory summary",
      sales: "for sale",
      rentals: "for rent",
      whatsapp: "WhatsApp",
      whatsappLabel: "direct response",
      inventory: "Inventory",
      inventoryLabel: "updated"
    },
    homeSupport: {
      aria: "Real estate follow-up",
      eyebrow: "Clear guidance",
      title: "Direct support for buying, selling, or renting with confidence",
      copy: "Every inquiry includes the context needed for a useful reply: move-in timing, property type, transaction type, budget, and phone number."
    },
    about: {
      eyebrow: "About Mara Barquet",
      title: "Real estate guidance in Boca del Rio, Veracruz",
      copy:
        "Mara guides families and investors through buying, selling, and renting properties across Veracruz, Boca del Rio, and Alvarado. She brings more than a decade of local experience, professional ethics, and personal follow-up to every transaction.",
      call: "Schedule a call",
      leadContext: "About Mara",
      whatsappMessage:
        "Hello Mara, I saw your website and would like to meet you to talk about a property.",
      statsAria: "Practice highlights",
      stats: [
        { value: "12+", label: "years of experience" },
        { value: "300+", label: "closed properties" },
        { value: "Boca del Rio", label: "Veracruz · Alvarado" }
      ],
      certificationsAria: "Certifications",
      certificationsEyebrow: "Professional credentials",
      certifications: [
        {
          title: "AMPI",
          description: "Mexican Association of Real Estate Professionals, Veracruz section."
        },
        {
          title: "Professional license",
          description: "Current state accreditation in Veracruz."
        },
        {
          title: "CIPS",
          description: "Certified International Property Specialist (NAR)."
        },
        {
          title: "Real Estate Diploma",
          description: "Valuation, financing, and trusts."
        }
      ]
    },
    explorer: {
      eyebrow: "Active inventory",
      title: "Search sales, rentals, and property features in real time",
      copy: "Listings update as you choose bedrooms, bathrooms, budget, property type, or location.",
      searchAria: "Property search",
      operationAria: "Transaction type",
      all: "All",
      search: "Search",
      searchPlaceholder: "City, area, or keyword",
      type: "Type",
      allTypes: "All",
      bedrooms: "Bedrooms",
      baths: "Bathrooms",
      maxPrice: "Max price",
      noLimit: "No limit",
      resultSingular: "available property",
      resultPlural: "available properties",
      specsAria: "Specifications",
      bedroomShort: "bd",
      bathLabel: "baths",
      parkingShort: "parking",
      details: "View details",
      map: "Map"
    },
    contact: {
      eyebrow: "Direct contact",
      title: "Tell us what you need and we will reply on WhatsApp",
      copy: "Your request includes your phone number so Mara can reply with context and follow up smoothly.",
      name: "Name",
      namePlaceholder: "Your name",
      phone: "Phone",
      email: "Email",
      emailPlaceholder: "email@example.com",
      moveDate: "When are you looking to move?",
      moveDatePlaceholder: "Date, season, or work assignment",
      lookingFor: "What are you looking for?",
      buy: "Buy",
      rent: "Rent",
      propertyType: "Property type",
      budget: "Budget",
      budgetPlaceholder: "Approximate range",
      message: "Message",
      messagePlaceholder: "Ideal area, special needs, or questions",
      submit: "Send via WhatsApp",
      sending: "Sending request...",
      error: "We could not save the request. Please try again.",
      success: "Request saved. WhatsApp will open with your message.",
      whatsappIntro: "Hello Mara, I am",
      whatsappFallbackName: "a client",
      whatsappPhone: "Phone number to reply",
      whatsappPending: "pending",
      whatsappLookingFor: "I am looking to",
      whatsappBuy: "buy",
      whatsappRent: "rent",
      whatsappType: "Property type",
      whatsappMoveDate: "Move-in date or season",
      whatsappToDefine: "to be defined",
      whatsappBudget: "Budget",
      whatsappMessage: "Message"
    },
    footer: {
      privacy: "Privacy notice",
      privacyCopy:
        "Data submitted through forms is used only to respond to real estate inquiries. To request access, correction, or deletion, write to",
      contact: "Contact"
    },
    detail: {
      contact: "Contact on WhatsApp",
      map: "Open map",
      descriptionEyebrow: "Description",
      title: "Property details",
      bedrooms: "bedrooms",
      baths: "bathrooms",
      parking: "parking spaces",
      builtYear: "Built in",
      yearPending: "Year to be confirmed",
      back: "Back to properties",
      mapTitle: "Map for",
      whatsappText: "Hello Mara, I am interested in {title}. Could you send me more information?",
      copyLink: "Copy link",
      linkCopied: "Link copied!"
    },
    notFound: {
      eyebrow: "Not found",
      title: "This property is not available",
      copy: "It may have been reserved, sold, or removed from the public inventory.",
      action: "View properties"
    },
    operations: {
      venta: "Sale",
      renta: "Rent",
      renta_temporal: "Short-term rent"
    },
    priceSuffix: {
      renta: " / mo.",
      renta_temporal: " / mo.",
      venta: ""
    },
    propertyTypes: {
      "Casa unifamiliar": "Single-family home",
      Departamento: "Apartment",
      Villa: "Villa",
      Oficina: "Office space",
      Bodega: "Warehouse",
      "Local comercial": "Retail space",
      Restaurante: "Restaurant",
      Edificio: "Building",
      Terreno: "Land"
    },
    properties: {
      "residencia-lomas-altas": {
        titulo: "Lomas Altas Residence",
        descripcion:
          "Contemporary residence with a private garden, covered terrace, and premium finishes for comfortable, discreet family living.",
        amenidades: ["Garden", "Terrace", "Integrated kitchen", "Study", "24/7 security"]
      },
      "departamento-playa-norte": {
        titulo: "Playa Norte Apartment",
        descripcion:
          "Bright apartment with a terrace, open layout, and quick access to services, the beach, and restaurants.",
        amenidades: ["Pool", "Gym", "Terrace", "Elevator", "Security"]
      },
      "villa-jardin-privado": {
        titulo: "Private Garden Villa",
        descripcion:
          "Furnished villa with generous spaces, mature landscaping, and privacy for long stays or executive relocation.",
        amenidades: ["Furnished", "Garden", "Pool", "Solar panels", "Pet friendly"]
      },
      "oficina-polanco": {
        titulo: "Polanco Office",
        descripcion:
          "Corporate floor ready for operation, with meeting rooms, reception area, and a strategic location for commercial teams.",
        amenidades: ["Reception", "Meeting rooms", "Elevator", "Parking", "Access control"]
      },
      "terreno-carretera-progreso": {
        titulo: "Progreso Highway Land",
        descripcion:
          "Land with wide frontage and commercial potential, ideal for mixed-use development or light storage.",
        amenidades: ["Wide frontage", "Commercial use", "Road access", "Nearby utilities"]
      }
    }
  }
} as const;

export type Translation = (typeof translations)[Language];

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}

export function getOperationLabel(operation: Operation, language: Language) {
  return translations[language].operations[operation];
}

export function getPriceSuffix(operation: Operation, language: Language) {
  return translations[language].priceSuffix[operation];
}

export function getPropertyTypeLabel(type: PropertyType, language: Language) {
  return translations[language].propertyTypes[type];
}

export function getPropertyCopy(property: PublicProperty, language: Language) {
  const propertyTranslations = translations[language].properties as Partial<Record<string, PropertyTranslation>>;
  const translated = propertyTranslations[property.id];

  return {
    titulo: translated?.titulo ?? property.titulo,
    descripcion: translated?.descripcion ?? property.descripcion,
    amenidades: translated?.amenidades ?? property.amenidades,
    tipo: getPropertyTypeLabel(property.tipo, language)
  };
}
