"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { AppLogo } from "@/components/shared/AppLogo";
import { useDemo } from "@/components/providers/DemoProvider";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function LandingPage() {
  const router = useRouter();
  const { enterDemoMode } = useDemo();

  function handleDemo() {
    enterDemoMode();
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-12">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AppLogo className="mb-8 h-24 w-24" />

        <h1 className="text-balance text-[32px] font-semibold leading-tight tracking-tight">
          {APP_NAME}
        </h1>
        <p className="mt-3 max-w-xs text-base text-[var(--text-secondary)]">
          {APP_TAGLINE}
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
          <Button size="lg" asChild>
            <Link href="/onboarding">เริ่มต้นใช้งาน</Link>
          </Button>
          <Button size="lg" variant="secondary" onClick={handleDemo}>
            ดู Demo
          </Button>
        </div>
      </div>

      <DisclaimerBanner compact className="mt-8" />
    </main>
  );
}
