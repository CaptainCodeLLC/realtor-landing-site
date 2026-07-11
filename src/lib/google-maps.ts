const coordinatePattern = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const shortLinkHosts = ["maps.app.goo.gl", "goo.gl", "g.co"];

function extractQueryFromUrl(url: string): string | null {
  const coordinateMatch = url.match(coordinatePattern);
  if (coordinateMatch) return `${coordinateMatch[1]},${coordinateMatch[2]}`;

  try {
    const parsed = new URL(url);
    const explicitQuery = parsed.searchParams.get("q") ?? parsed.searchParams.get("query");
    if (explicitQuery) return explicitQuery;

    const placeMatch = parsed.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch) return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  } catch {
    return null;
  }

  return null;
}

function isShortLink(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return shortLinkHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

/**
 * Google Maps share links (especially maps.app.goo.gl short links) don't expose
 * coordinates directly, so this resolves the redirect to recover an embeddable
 * query. Falls back to the provided address whenever nothing can be extracted.
 */
export async function resolveMapEmbedQuery(googleMapsUrl: string, fallbackAddress: string) {
  const trimmed = googleMapsUrl.trim();
  if (!trimmed) return fallbackAddress;

  const direct = extractQueryFromUrl(trimmed);
  if (direct) return direct;

  if (isShortLink(trimmed)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(trimmed, { redirect: "follow", signal: controller.signal });
      clearTimeout(timeout);
      const resolved = extractQueryFromUrl(response.url);
      if (resolved) return resolved;
    } catch {
      return fallbackAddress;
    }
  }

  return fallbackAddress;
}
