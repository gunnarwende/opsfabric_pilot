import { redirect } from "next/navigation";

/**
 * Root page — redirects to pilot customer.
 * In Phase 4 this becomes a landing page / customer selector.
 */
export default function RootPage() {
  redirect("/doerfler-ag");
}
