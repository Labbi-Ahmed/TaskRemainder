"use client";
import PageError from "../../components/Common/PageError";

export default function LoginError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} title="Login page error" />;
}
