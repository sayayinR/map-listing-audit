import { CheckDefinition, CheckId } from "@/lib/types";

// Weights total 100.
// Thresholds here are display text for /guide. The scoring logic is in
// lib/build-audit.ts; keep them in sync.
export const CHECKS: Record<CheckId, CheckDefinition> = {
  "primary-category": {
    id: "primary-category",
    group: "info",
    label: "Primary category set",
    weight: 20,
    measures: "Whether the listing has a primary category.",
    thresholds: { pass: "A primary category is set", fail: "No primary category" },
  },
  hours: {
    id: "hours",
    group: "info",
    label: "Business hours listed",
    weight: 15,
    measures: "Whether business hours are listed.",
    thresholds: { pass: "Hours are listed", fail: "No hours listed" },
  },
  phone: {
    id: "phone",
    group: "info",
    label: "Phone number listed",
    weight: 10,
    measures: "Whether the listing has a phone number.",
    thresholds: { pass: "A phone number is listed", fail: "No phone number" },
  },
  website: {
    id: "website",
    group: "info",
    label: "Website linked",
    weight: 10,
    measures: "Whether the listing links to a website.",
    thresholds: { pass: "A website is linked", fail: "No website" },
  },
  "photo-count": {
    id: "photo-count",
    group: "photos",
    label: "Photo count",
    weight: 20,
    measures:
      "How many photos are on the listing. The Places API returns at most 10, so 10 means 10 or more.",
    thresholds: { pass: "10 or more", warn: "5–9", fail: "Under 5" },
  },
  "review-count": {
    id: "review-count",
    group: "reviews",
    label: "Number of reviews",
    weight: 15,
    measures: "How many reviews the listing has.",
    thresholds: { pass: "50 or more", warn: "10–49", fail: "Under 10" },
  },
  rating: {
    id: "rating",
    group: "reviews",
    label: "Average rating",
    weight: 10,
    measures: "The listing's average star rating.",
    thresholds: { pass: "4.5 or higher", warn: "4.0–4.4", fail: "Under 4.0, or no rating yet" },
  },
};
