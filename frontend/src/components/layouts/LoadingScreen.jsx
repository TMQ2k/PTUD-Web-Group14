import React from "react";
import { IoLogoPolymer } from "react-icons/io";

const LoadingScreen = ({ exiting = false, duration = 700 }) => {
  return (
    <div
      className={[
        "pointer-events-none fixed inset-0 z-9999 flex items-center justify-center",
        "bg-linear-to-r from-blue-400 to-purple-600",
        "transition-opacity",
        `duration-[${duration}ms]`,
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-busy
      aria-live="polite"
    >
      {/* Glass card */}
      <div
        className={[
          "pointer-events-auto w-[min(92vw,520px)]",
          "rounded-2xl p-8 shadow-2xl",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "transition-transform",
          exiting ? "scale-[0.98]" : "scale-100",
        ].join(" ")}
      >
        {/* Logo & brand */}
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center h-14 w-14 rounded-2xl bg-white/10">
            <div className="absolute inset-0 rounded-2xl bg-white/10 blur-md" />
            <IoLogoPolymer className="relative z-10 h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              AuctionHub
            </h1>
            <p className="text-white/80 text-sm">
              Đang chuẩn bị trải nghiệm của bạn...
            </p>
          </div>
        </div>

        {/* BIG Spinner (no progress bar) */}
        <div className="mt-8 flex items-center gap-5">
          {/* Dual-ring conic spinner */}
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,white_0%,transparent_60%)]" />
            <div className="absolute inset-1 rounded-full bg-white/15 backdrop-blur-sm" />
            <div className="absolute inset-4 rounded-full bg-white/30 animate-pulse" />
          </div>
          <div>
            <p className="text-white/90 font-medium">
              Đang tải dữ liệu & tài nguyên…
            </p>
            <p className="text-white/70 text-sm">Sẵn sàng trong giây lát.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
