import { Suspense } from "react";
import CategoryPageClient from "./CategoryPageClient";

export default function CategoryPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <CategoryPageClient />
    </Suspense>
  );
}
