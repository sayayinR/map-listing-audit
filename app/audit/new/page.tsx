import type { Metadata } from "next";
import NewAuditForm from "./new-audit-form";

export const metadata: Metadata = {
  title: "New audit",
};

export default function NewAuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New audit</h1>
      <NewAuditForm />
    </div>
  );
}
