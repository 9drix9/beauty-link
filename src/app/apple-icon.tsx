import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3d1a0f",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            letterSpacing: -4,
          }}
        >
          B
        </span>
        <span
          style={{
            fontSize: 100,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            letterSpacing: -4,
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
