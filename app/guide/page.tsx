import type { Metadata } from "next";
import { CHECKS } from "@/lib/checks";
import {
  GROUP_LABELS,
  GROUPS,
  STATUS_BADGE,
  STATUS_LABELS,
} from "@/lib/group-check";
import { CREDIT } from "@/lib/score";

export const metadata: Metadata = {
  title: "Guide",
};

const OUTCOMES = ["pass", "warn", "fail"] as const;

// Static: no request data, so Next prerenders this page at build time.
export default function GuidePage() {
  const checks = Object.values(CHECKS);

  return (
    <div>
      <h1 className="text-2xl font-bold">How audits are scored</h1>
      <p className="mt-2 max-w-2xl">
        Each audit gets a score out of 100. Every check below is worth its
        weight in points, and the weights add up to 100. A check earns part of
        its weight depending on the result:
      </p>
      <ul className="mt-2 list-disc pl-6">
        {OUTCOMES.map((status) => (
          <li key={status}>
            {STATUS_LABELS[status]}: {CREDIT[status] * 100}% of the weight
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-2xl">
        If a check can&apos;t run, for example because Google didn&apos;t return
        the data, it&apos;s left out of the score instead of counting against
        the business.
      </p>

      {GROUPS.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-xl font-semibold">{GROUP_LABELS[group]}</h2>
          <ul className="mt-3 space-y-3">
            {checks
              .filter((c) => c.group === group)
              .sort((a, b) => b.weight - a.weight)
              .map((check) => (
                <li key={check.id} className="rounded border p-3">
                  <h3 className="font-semibold">{check.label}</h3>
                  <p className="text-sm text-gray-600">
                    Weight: {check.weight} points
                  </p>
                  <p className="mt-1">{check.measures}</p>
                  <dl className="mt-2 space-y-1">
                    {OUTCOMES.map((status) => {
                      const text = check.thresholds[status];
                      if (!text) return null;
                      return (
                        <div key={status} className="flex items-center gap-2">
                          <dt
                            className={`w-14 rounded px-2 py-0.5 text-center text-sm font-medium ${STATUS_BADGE[status]}`}
                          >
                            {STATUS_LABELS[status]}
                          </dt>
                          <dd>{text}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
