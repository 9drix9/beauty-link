import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            letterSpacing: -1,
          }}
        >
          B
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            letterSpacing: -1,
          }}
        >
          L
        </span>
      </div>
    ),
    { ...size }
  );
}
