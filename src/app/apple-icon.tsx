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
          background: "linear-gradient(145deg, #6A1B9A 0%, #9C27B0 50%, #FF6A3D 100%)",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 130,
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            letterSpacing: -4,
          }}
        >
          b
        </span>
      </div>
    ),
    { ...size }
  );
}
