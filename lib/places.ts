import "server-only";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
};

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  if (!API_KEY) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const res = await fetch(`${BASE_URL}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      // Pro tier only: id, name, address (5,000 free/month)
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: query }),
  });

  if (!res.ok) {
    throw new Error(`Places search failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return (data.places ?? []).map((p: any) => ({
    id: p.id,
    name: p.displayName?.text ?? "",
    address: p.formattedAddress ?? "",
  }));
}