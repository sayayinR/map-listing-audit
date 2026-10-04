import { CHECKS } from "@/lib/checks";
import { CheckResult, CheckStatus } from "@/lib/types";

const CREDIT: Record<Exclude<CheckStatus, "error">, number> = {
  pass: 1,
  warn: 0.5,
  fail: 0,
};

// Score out of 100. Checks that errored are left out entirely, so a failed
// lookup doesn't count against the business.
export function computeScore(results: CheckResult[]): number | null {
  let earned = 0;
  let possible = 0;
  for (const result of results) {
    if (result.status === "error") continue;
    const weight = CHECKS[result.id].weight;
    possible += weight;
    earned += weight * CREDIT[result.status];
  }
  return possible === 0 ? null : Math.round((earned / possible) * 100);
}
