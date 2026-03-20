import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeautyLink",
    short_name: "BeautyLink",
    description:
      "Discover discounted beauty appointments from verified professionals in Los Angeles.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf5f0",
    theme_color: "#3d1a0f",
    orientation: "portrait",
    categories: ["beauty", "lifestyle", "shopping"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
