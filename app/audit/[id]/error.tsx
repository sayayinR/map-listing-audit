"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <h1 className="text-2xl font-bold">Audit couldn&apos;t run</h1>
      <p className="mt-2">
        Google didn&apos;t return data for this business. Try again, or start a new
        search.
      </p>
      <button onClick={reset} className="mt-4 rounded border px-4 py-2">
        Try again
      </button>
    </div>
  );
}
