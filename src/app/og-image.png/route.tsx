import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e3a5f 0%, transparent 50%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="6" width="6" height="4" />
              <rect x="9" y="6" width="6" height="4" />
              <rect x="17" y="6" width="6" height="4" />
              <rect x="1" y="14" width="6" height="4" />
              <rect x="9" y="14" width="6" height="4" />
              <rect x="17" y="14" width="6" height="4" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
            }}
          >
            BrickProfile
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Professional Portfolio Websites for Contractors
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            marginTop: 50,
            gap: 40,
          }}
        >
          {["AI-Powered", "Lead Generation", "Beautiful Templates"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#18181b",
                  padding: "12px 24px",
                  borderRadius: 50,
                  border: "1px solid #27272a",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#3b82f6",
                    marginRight: 12,
                  }}
                />
                <span style={{ color: "#d4d4d8", fontSize: 20 }}>{feature}</span>
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#52525b",
          }}
        >
          brickprofile.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
