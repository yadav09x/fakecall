import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{
        width: 280,
        height: 560,
      }}
    >
      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[2.5rem] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.02 240) 0%, oklch(0.12 0.015 240) 100%)",
          boxShadow:
            "0 0 0 1.5px oklch(0.30 0.025 235), 0 32px 64px oklch(0.05 0.01 240 / 0.9), inset 0 1px 0 oklch(0.35 0.02 235)",
        }}
      />
      {/* Screen area */}
      <div
        className="absolute rounded-[2.2rem] overflow-hidden"
        style={{
          top: 6,
          left: 6,
          right: 6,
          bottom: 6,
          background: "oklch(0.10 0.020 240)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 80,
            height: 20,
            background: "oklch(0.12 0.018 240)",
            borderRadius: "0 0 12px 12px",
          }}
        />
        <div className="h-full w-full pt-6">{children}</div>
      </div>
    </div>
  );
}
