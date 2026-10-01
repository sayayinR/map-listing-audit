export type CheckStatus = "pass" | "warn" | "fail" | "error";

export type CheckGroup = "info" | "photos" | "reviews";

export type CheckId =
  | "primary-category"
  | "hours"
  | "phone"
  | "website"
  | "photo-count"
  | "review-count"
  | "rating";

// Static: what a check is and how it's scored. Lives in lib/checks.ts.
export type CheckDefinition = {
  id: CheckId;
  group: CheckGroup;
  label: string;         // "Business hours listed"
  weight: number;
  description: string;   // shown on /guide
};

// Per-audit: what the check found for this business.
export type CheckResult = {
  id: CheckId;
  status: CheckStatus;
  detail: string;        // "Hours listed for all 7 days."
};

// Places API returns at most 5 reviews per place.
export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  publishTime: string;   // ISO 8601
};

// A Claude draft. Always editable; nothing is published automatically.
export type Fix = {
  id: string;
  kind: "description" | "categories" | "review-reply" | "schema";
  reviewId?: string;     // set when kind is "review-reply"
  draft: string;
  status: "draft" | "approved";
  generatedAt: string;
};

export type Audit = {
  id: string;
  createdAt: string;
  business: {
    placeId: string;
    name: string;
    city: string;
    address: string;
    phone?: string;
    website?: string;
    primaryCategory: string;
    categories: string[];
    hours?: string[];
    rating?: number;
    reviewCount: number;
    photoCount: number;  // Places API caps this at 10
  };
  reviews: Review[];
  checks: CheckResult[];
  fixes: Fix[];          // empty until "Generate fixes" runs
  score: number;         // from computeScore(checks)
};
