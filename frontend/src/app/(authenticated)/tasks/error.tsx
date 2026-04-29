"use client";
import PageError from "../../../components/Common/PageError";

export default function TasksError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} title="Tasks failed to load" />;
}
