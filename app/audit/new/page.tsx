"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAuditPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/audit/search?q=${encodeURIComponent(`${name} ${city}`)}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">New audit</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Business name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div>
          <label htmlFor="city" className="block font-medium">
            City
          </label>
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Run audit
        </button>
      </form>
    </div>
  );
}
