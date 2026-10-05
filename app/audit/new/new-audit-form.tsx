"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { NewAuditState, startAudit } from "./actions";

const initialState: NewAuditState = {
  errors: {},
  values: { name: "", city: "" },
};

export default function NewAuditForm() {
  const [state, formAction] = useActionState(startAudit, initialState);
  const nameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  // Move focus to the first invalid field so its error is read out.
  useEffect(() => {
    if (state.errors.name) nameRef.current?.focus();
    else if (state.errors.city) cityRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium">
          Business name
        </label>
        <input
          id="name"
          name="name"
          ref={nameRef}
          defaultValue={state.values.name}
          required
          aria-invalid={state.errors.name ? true : undefined}
          aria-describedby={state.errors.name ? "name-error" : undefined}
          className="mt-1 w-full rounded border p-2"
        />
        {state.errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-700">
            {state.errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="city" className="block font-medium">
          City
        </label>
        <input
          id="city"
          name="city"
          ref={cityRef}
          defaultValue={state.values.city}
          required
          aria-invalid={state.errors.city ? true : undefined}
          aria-describedby={state.errors.city ? "city-error" : undefined}
          className="mt-1 w-full rounded border p-2"
        />
        {state.errors.city && (
          <p id="city-error" className="mt-1 text-sm text-red-700">
            {state.errors.city}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}

// Must be a child of the <form>: useFormStatus reads the nearest parent form.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? "Searching…" : "Run audit"}
    </button>
  );
}
