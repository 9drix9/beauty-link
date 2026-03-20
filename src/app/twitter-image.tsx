import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BeautyLink | Great Beauty. Better Prices.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5e8da 0%, #faf5f0 50%, #f0e4d6 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
          <span style={{ fontSize: 72, fontWeight: 700, color: "#3d1a0f" }}>
            Beauty
          </span>
          <span style={{ fontSize: 72, fontStyle: "italic", color: "#3d1a0f" }}>
            Link
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#3d1a0f",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          Great Beauty. Better Prices.
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#9a7b6a",
            fontFamily: "sans-serif",
            marginTop: 8,
          }}
        >
          Los Angeles Beauty Marketplace
        </div>
      </div>
    ),
    { ...size }
  );
}
