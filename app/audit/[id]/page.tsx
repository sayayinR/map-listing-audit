import { buildAudit } from "@/lib/build-audit";
import {
  checksForGroup,
  GROUP_LABELS,
  GROUPS,
  STATUS_LABELS,
} from "@/lib/group-check";
import { getPlaceDetails } from "@/lib/places";
import { sampleAudit } from "@/lib/sample-audit";
import { computeScore } from "@/lib/score";
import ChatPanel from "./chat-panel";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit =
    id === "sample" ? sampleAudit : buildAudit(await getPlaceDetails(id));
  const score = computeScore(audit.checks);
  const total = audit.checks.length;
  const errored = audit.checks.filter((c) => c.status === "error").length;

  const BADGE = {
    pass: "bg-green-100 text-green-800",
    warn: "bg-yellow-100 text-yellow-800",
    fail: "bg-red-100 text-red-800",
    error: "bg-gray-200 text-gray-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">{audit.business.name}</h1>
      <p className="text-gray-600">{audit.business.address}</p>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt>Category</dt>
          <dd>{audit.business.primaryCategory}</dd>
        </div>
        {/* rating, reviews, phone the same way */}
        <div>
          <dt>Rating</dt>
          <dd>{audit.business.rating ?? "No rating"}</dd>
        </div>
        <div>
          <dt>Reviews</dt>
          <dd>{audit.business.reviewCount}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{audit.business.phone ?? "Not listed"}</dd>
        </div>
      </dl>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Overall score</h2>
        {score === null ? (
          <p>Audit failed. No checks could run.</p>
        ) : (
          <>
            <p className="text-4xl font-bold">{score} / 100</p>
            {errored > 0 && (
              <p>
                Based on {total - errored} of {total} checks
              </p>
            )}
          </>
        )}
      </section>

      {GROUPS.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-xl font-semibold">{GROUP_LABELS[group]}</h2>
          <ul className="mt-3 space-y-3">
            {checksForGroup(audit.checks, group).map((check) => (
              <li key={check.id} className="rounded border p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-sm font-medium ${BADGE[check.status]}`}
                  >
                    {STATUS_LABELS[check.status]}
                  </span>
                  <strong>{check.label}</strong>
                </div>
                <p className="mt-1 text-gray-600">{check.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <ChatPanel
        context={{
          business: audit.business,
          checks: audit.checks,
          reviews: audit.reviews,
          score,
        }}
      />
    </div>
  );
}
