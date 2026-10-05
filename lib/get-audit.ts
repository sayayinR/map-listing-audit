import "server-only";
import { cache } from "react";
import { buildAudit } from "@/lib/build-audit";
import { getPlaceDetails } from "@/lib/places";
import { sampleAudit } from "@/lib/sample-audit";
import { Audit } from "@/lib/types";

// Memoized per request: generateMetadata and the page share one Places call.
export const getAudit = cache(
  async (id: string): Promise<Audit> =>
    id === "sample" ? sampleAudit : buildAudit(await getPlaceDetails(id)),
);
