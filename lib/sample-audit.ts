import { Audit } from "@/lib/types";

export const sampleAudit: Audit = {
  id: "sample",
  createdAt: "2026-10-01T15:00:00Z",
  business: {
    placeId: "ChIJ7wX3kqZ09YgRm2Lc5yQf0aE",
    name: "Summit Peak Roofing",
    city: "Roswell, GA",
    address: "123 Holcomb Bridge Rd, Roswell, GA 30076, USA",
    phone: "(770) 555-0142",
    website: "https://summitpeakroofing.example.com",
    primaryCategory: "Roofing contractor",
    categories: ["Roofing contractor", "General contractor"],
    hours: [
      "Monday: 7:00 AM – 6:00 PM",
      "Tuesday: 7:00 AM – 6:00 PM",
      "Wednesday: 7:00 AM – 6:00 PM",
      "Thursday: 7:00 AM – 6:00 PM",
      "Friday: 7:00 AM – 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    rating: 4.6,
    reviewCount: 23,
    photoCount: 4,
  },
  reviews: [
    {
      id: "review-1",
      author: "Dana M.",
      rating: 5,
      text: "Replaced our whole roof in two days and cleaned up every nail. Fair price and great communication.",
      publishTime: "2026-09-12T18:24:00Z",
    },
    {
      id: "review-2",
      author: "Chris T.",
      rating: 4,
      text: "Good work on a storm repair. Took a week to get on the schedule, but the crew was professional.",
      publishTime: "2026-08-03T14:10:00Z",
    },
    {
      id: "review-3",
      author: "Priya K.",
      rating: 3,
      text: "Repair fixed the leak, but nobody called back about the gutter quote.",
      publishTime: "2026-05-21T21:45:00Z",
    },
  ],
  checks: [
    {
      id: "primary-category",
      status: "pass",
      detail: "Primary category is Roofing contractor.",
    },
    {
      id: "hours",
      status: "pass",
      detail: "Hours listed for all 7 days.",
    },
    {
      id: "phone",
      status: "pass",
      detail: "Phone number (770) 555-0142 is listed.",
    },
    {
      id: "website",
      status: "pass",
      detail: "Website link is present.",
    },
    {
      id: "photo-count",
      status: "fail",
      detail: "Only 4 photos. Aim for at least 10, including recent job photos.",
    },
    {
      id: "review-count",
      status: "warn",
      detail: "23 reviews. Aim for 50 or more.",
    },
    {
      id: "rating",
      status: "pass",
      detail: "4.6 average rating.",
    },
  ],
  fixes: [],
  score: 73,
};