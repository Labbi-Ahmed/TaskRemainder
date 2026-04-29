"use client";
import PageError from "../../../components/Common/PageError";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} title="Dashboard failed to load" />;
}
