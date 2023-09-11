"use client";

// This stupidness is used because there is no way to opt-out of
// next.js client side in memory cache. Which will cache the
// server rendered component.

// Use this along with no prefetching when you want a server
// render to behave as I'd expect upon soft nav.

// Sadly we are currently opting out not in, let us hope Vercel
// gets their fucking shit together.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForceRefresh({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
