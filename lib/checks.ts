import { CheckDefinition, CheckId } from "@/lib/types";

// Weights total 100.
export const CHECKS: Record<CheckId, CheckDefinition> = {
  "primary-category": {
    id: "primary-category",
    group: "info",
    label: "Primary category set",
    weight: 20,
    description: "Pass if the listing has a primary category. Fail if it's missing.",
  },
  hours: {
    id: "hours",
    group: "info",
    label: "Business hours listed",
    weight: 15,
    description: "Pass if business hours are listed. Fail if they're missing.",
  },
  phone: {
    id: "phone",
    group: "info",
    label: "Phone number listed",
    weight: 10,
    description: "Pass if the listing has a phone number. Fail if it's missing.",
  },
  website: {
    id: "website",
    group: "info",
    label: "Website linked",
    weight: 10,
    description: "Pass if the listing links to a website. Fail if it's missing.",
  },
  "photo-count": {
    id: "photo-count",
    group: "photos",
    label: "Photo count",
    weight: 20,
    description:
      "Pass at 10 or more photos, warn at 5–9, fail under 5. The Places API returns at most 10 photos, so 10 means 10 or more.",
  },
  "review-count": {
    id: "review-count",
    group: "reviews",
    label: "Number of reviews",
    weight: 15,
    description: "Pass at 50 or more reviews, warn at 10–49, fail under 10.",
  },
  rating: {
    id: "rating",
    group: "reviews",
    label: "Average rating",
    weight: 10,
    description: "Pass at 4.5 or higher, warn at 4.0–4.4, fail under 4.0 or with no rating.",
  },
};
