"use client";

import { useEffect } from "react";

type AdFormat = "banner" | "rectangle" | "sidebar" | "inline";

interface AdSlotProps {
  format?: AdFormat;
  slot?: string;
  className?: string;
}

const AD_HEIGHTS: Record<AdFormat, string> = {
  banner:    "min-h-[90px]",
  rectangle: "min-h-[250px]",
  sidebar:   "min-h-[250px] lg:min-h-[600px]",
  inline:    "min-h-[90px] sm:min-h-[250px]",
};

export default function AdSlot({ format = "banner", slot, className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!clientId) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [clientId]);

  // Show placeholder when AdSense not configured
  if (!clientId) {
    return (
      <div
        className={`${AD_HEIGHTS[format]} w-full rounded-xl bg-gray-50 flex items-center justify-center ${className}`}
        role="presentation"
        aria-hidden="true"
      >
        <span className="text-xs text-gray-300 font-mono">
          Ad — {format}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${AD_HEIGHTS[format]} w-full rounded-xl bg-gray-50 overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot || "auto"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
