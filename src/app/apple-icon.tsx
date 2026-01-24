import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

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
          background: "#132039",
          borderRadius: 32,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="#f97316"
        >
          <rect x="2" y="6" width="9" height="5" rx="0.5" />
          <rect x="13" y="6" width="9" height="5" rx="0.5" />
          <rect x="6" y="13" width="9" height="5" rx="0.5" />
          <rect x="17" y="13" width="5" height="5" rx="0.5" />
          <rect x="2" y="13" width="2" height="5" rx="0.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
