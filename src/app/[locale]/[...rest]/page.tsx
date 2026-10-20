import { notFound } from "next/navigation";

/** Anything not matched above renders the locale-aware 404. */
export default function CatchAll() {
  notFound();
}
