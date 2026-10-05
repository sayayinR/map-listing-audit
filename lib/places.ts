import "server-only";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
};

type LocalizedText = { text: string; languageCode?: string };

type PlaceReview = {
  name: string;  // "places/{id}/reviews/{id}", used as Review.id
  rating: number;
  text?: LocalizedText;
  publishTime: string;
  authorAttribution?: { displayName?: string };
};

// Matches DETAILS_FIELDS. Google omits fields that have no value, so all are
// optional except id.
export type PlaceDetails = {
  id: string;
  displayName?: LocalizedText;
  formattedAddress?: string;
  addressComponents?: { longText: string; shortText: string; types: string[] }[];
  nationalPhoneNumber?: string;
  websiteUri?: string;
  primaryTypeDisplayName?: LocalizedText;
  types?: string[];
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  rating?: number;
  userRatingCount?: number;
  photos?: { name: string }[];  // only the count is used
  reviews?: PlaceReview[];
};

// Matches the search field mask: places.id, displayName, formattedAddress.
type SearchTextResponse = {
  places?: Pick<PlaceDetails, "id" | "displayName" | "formattedAddress">[];
};

const DETAILS_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "addressComponents",
  "nationalPhoneNumber",
  "websiteUri",
  "primaryTypeDisplayName",
  "types",
  "regularOpeningHours.weekdayDescriptions",
  "rating",
  "userRatingCount",
  "photos",
  "reviews",
].join(",");

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  if (!API_KEY) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const res = await fetch(`${BASE_URL}/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": DETAILS_FIELDS,
    },
  });

  if (!res.ok) {
    throw new Error(`Place details failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

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

  const data: SearchTextResponse = await res.json();
  return (data.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? "",
    address: p.formattedAddress ?? "",
  }));
}