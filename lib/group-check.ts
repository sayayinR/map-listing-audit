import { CHECKS } from "@/lib/checks";
import { CheckResult } from "@/lib/types";

const STATUS_ORDER = { fail: 0, error: 1, warn: 2, pass: 3 };

export const GROUPS = ["info", "photos", "reviews"] as const;
export const GROUP_LABELS = { info: "Info", photos: "Photos", reviews: "Reviews" };
export const STATUS_LABELS = { pass: "Pass", warn: "Warn", fail: "Fail", error: "Error" };
export const STATUS_BADGE = {
  pass: "bg-green-100 text-green-800",
  warn: "bg-yellow-100 text-yellow-800",
  fail: "bg-red-100 text-red-800",
  error: "bg-gray-200 text-gray-800",
};

export function checksForGroup(results: CheckResult[], group: (typeof GROUPS)[number]) {
  return results
    .filter((r) => CHECKS[r.id].group === group)
    .map((r) => ({ ...r, label: CHECKS[r.id].label }))
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}