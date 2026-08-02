import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0f",
        color: "#fafafa",
        fontFamily: "system-ui, sans-serif",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          borderRadius: 24,
          background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
          fontSize: 56,
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        C
      </div>
      <div style={{ marginTop: 40, fontSize: 72, fontWeight: 800, letterSpacing: "-0.02em" }}>
        CODIQ
      </div>
      <div style={{ marginTop: 16, fontSize: 32, color: "#a1a1aa", textAlign: "center" }}>
        The Full Stack Developer Laboratory
      </div>
      <div style={{ marginTop: 24, fontSize: 22, color: "#71717a", textAlign: "center" }}>
        Read · Understand · Experiment · Solve · Build
      </div>
    </div>,
    { ...size },
  );
}
