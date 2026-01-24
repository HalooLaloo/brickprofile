import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Professional Portfolio";
  const subtitle = searchParams.get("subtitle") || "";
  const image = searchParams.get("image") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0a0b",
        }}
      >
        {/* Background image with overlay */}
        {image && (
          <img
            src={image}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.9) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 60,
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Company name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "white",
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* Subtitle (headline or service areas) */}
          {subtitle && (
            <div
              style={{
                fontSize: 32,
                color: "#a1a1aa",
                marginBottom: 24,
              }}
            >
              {subtitle}
            </div>
          )}

          {/* BrickProfile badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="1" y="6" width="6" height="4" />
                <rect x="9" y="6" width="6" height="4" />
                <rect x="17" y="6" width="6" height="4" />
                <rect x="1" y="14" width="6" height="4" />
                <rect x="9" y="14" width="6" height="4" />
                <rect x="17" y="14" width="6" height="4" />
              </svg>
            </div>
            <span style={{ color: "#71717a", fontSize: 20 }}>
              Built with BrickProfile
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
