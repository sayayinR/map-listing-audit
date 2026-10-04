import { sampleAudit } from "@/lib/sample-audit";
import { computeScore } from "@/lib/score";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = sampleAudit; // week 2: fetch the real audit by id
  const score = computeScore(audit.checks);
  const total = audit.checks.length;
  const errored = audit.checks.filter((c) => c.status === "error").length;

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
    </div>
  );
}
