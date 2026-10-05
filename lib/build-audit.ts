import { Audit, CheckResult } from "@/lib/types";
import { computeScore } from "@/lib/score";
import type { PlaceDetails } from "@/lib/places";

export function buildAudit(place: PlaceDetails): Audit {
  const photoCount = place.photos?.length ?? 0;
  const reviewCount = place.userRatingCount ?? 0;
  const rating = place.rating;
  const hours = place.regularOpeningHours?.weekdayDescriptions;
  const city =
    place.addressComponents?.find((c) => c.types.includes("locality"))?.longText ?? "";

  const checks: CheckResult[] = [
    place.primaryTypeDisplayName?.text
      ? { id: "primary-category", status: "pass", detail: `Primary category is ${place.primaryTypeDisplayName.text}.` }
      : { id: "primary-category", status: "fail", detail: "No primary category set." },
    hours?.length
      ? { id: "hours", status: "pass", detail: "Business hours are listed." }
      : { id: "hours", status: "fail", detail: "No business hours listed." },
    place.nationalPhoneNumber
      ? { id: "phone", status: "pass", detail: `Phone number ${place.nationalPhoneNumber} is listed.` }
      : { id: "phone", status: "fail", detail: "No phone number listed." },
    place.websiteUri
      ? { id: "website", status: "pass", detail: "Website link is present." }
      : { id: "website", status: "fail", detail: "No website linked." },
    {
      id: "photo-count",
      status: photoCount >= 10 ? "pass" : photoCount >= 5 ? "warn" : "fail",
      detail: photoCount >= 10 ? "10 or more photos." : `Only ${photoCount} photos. Aim for at least 10.`,
    },
    {
      id: "review-count",
      status: reviewCount >= 50 ? "pass" : reviewCount >= 10 ? "warn" : "fail",
      detail: `${reviewCount} reviews.${reviewCount < 50 ? " Aim for 50 or more." : ""}`,
    },
    rating === undefined
      ? { id: "rating", status: "fail", detail: "No rating yet." }
      : {
          id: "rating",
          status: rating >= 4.5 ? "pass" : rating >= 4.0 ? "warn" : "fail",
          detail: `${rating} average rating.`,
        },
  ];

  return {
    id: place.id,
    createdAt: new Date().toISOString(),
    business: {
      placeId: place.id,
      name: place.displayName?.text ?? "",
      city,
      address: place.formattedAddress ?? "",
      phone: place.nationalPhoneNumber,
      website: place.websiteUri,
      primaryCategory: place.primaryTypeDisplayName?.text ?? "",
      categories: place.types ?? [],
      hours,
      rating,
      reviewCount,
      photoCount,
    },
    reviews: (place.reviews ?? []).map((r) => ({
      id: r.name,
      author: r.authorAttribution?.displayName ?? "Anonymous",
      rating: r.rating,
      text: r.text?.text ?? "",
      publishTime: r.publishTime,
    })),
    checks,
    fixes: [],
    score: computeScore(checks) ?? 0,
  };
}