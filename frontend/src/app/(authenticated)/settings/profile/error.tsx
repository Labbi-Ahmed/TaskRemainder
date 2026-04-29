"use client";
import PageError from "../../../../components/Common/PageError";

export default function ProfileError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} title="Profile failed to load" />;
}
