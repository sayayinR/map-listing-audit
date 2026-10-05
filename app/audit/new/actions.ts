"use server";

import { redirect } from "next/navigation";

export type NewAuditState = {
  errors: { name?: string; city?: string };
  values: { name: string; city: string };
};

// Server Actions are public POST endpoints. When /login lands, check the
// session against ALLOWED_EMAIL here too.
export async function startAudit(
  _prev: NewAuditState,
  formData: FormData,
): Promise<NewAuditState> {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  const errors: NewAuditState["errors"] = {};
  if (!name) errors.name = "Enter the business name.";
  else if (name.length > 100) errors.name = "Keep the business name under 100 characters.";
  if (!city) errors.city = "Enter the city.";
  else if (city.length > 100) errors.city = "Keep the city under 100 characters.";

  // Return the values too: React resets the form after the action, so this
  // is how the fields keep what was typed.
  if (errors.name || errors.city) return { errors, values: { name, city } };

  // redirect() throws, so it must stay outside any try/catch.
  redirect(`/audit/search?q=${encodeURIComponent(`${name} ${city}`)}`);
}
