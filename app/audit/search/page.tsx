import Link from "next/link";
import { searchPlaces } from "@/lib/places";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <p>
        No search entered. <Link href="/audit/new">Start a new audit</Link>.
      </p>
    );
  }

  const results = await searchPlaces(q);

  return (
    <div>
      <h1 className="text-2xl font-bold">Results for "{q}"</h1>

      {results.length === 0 ? (
        <p className="mt-4">
          No businesses found. <Link href="/audit/new">Try another search</Link>
          .
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {results.map((place) => (
            <li key={place.id} className="rounded border p-3">
              <Link
                href={`/audit/${place.id}`}
                className="font-medium underline"
              >
                {place.name}
              </Link>
              <p className="text-gray-600">{place.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
