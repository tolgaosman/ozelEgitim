import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fbf7f1",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: "#b3541f",
            marginBottom: 32,
          }}
        />
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#12283f" }}>{SITE_NAME}</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: "#3d5266" }}>
          Özel Eğitim ve Rehabilitasyon Merkezi
        </div>
      </div>
    ),
    { ...size },
  );
}
