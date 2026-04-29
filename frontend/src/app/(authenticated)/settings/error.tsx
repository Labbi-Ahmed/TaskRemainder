"use client";
import PageError from "../../../components/Common/PageError";

export default function SettingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} title="Settings failed to load" />;
}
