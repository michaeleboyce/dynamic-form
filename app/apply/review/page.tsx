"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReviewStep() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dynamic page since Review and Dynamic are now combined
    router.replace("/apply/dynamic");
  }, [router]);

  return (
    <div className="p-8 text-center">
      <p className="text-gray-600">Redirecting to Dynamic Questions...</p>
    </div>
  );
}