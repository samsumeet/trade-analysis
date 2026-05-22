import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(145deg, rgba(4,16,32,1), rgba(12,34,70,1), rgba(10,105,98,1))",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "8px solid rgba(38, 211, 242, 0.95)",
            borderRadius: 42,
            display: "flex",
            height: 124,
            justifyContent: "center",
            position: "relative",
            transform: "rotate(0deg)",
            width: 124
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #69F08A, #14A9F2)",
              borderRadius: 8,
              height: 46,
              left: 28,
              position: "absolute",
              top: 52,
              width: 16
            }}
          />
          <div
            style={{
              background: "linear-gradient(180deg, #69F08A, #14A9F2)",
              borderRadius: 8,
              height: 62,
              left: 54,
              position: "absolute",
              top: 36,
              width: 16
            }}
          />
          <div
            style={{
              background: "linear-gradient(180deg, #69F08A, #14A9F2)",
              borderRadius: 8,
              height: 76,
              left: 80,
              position: "absolute",
              top: 22,
              width: 16
            }}
          />
          <div
            style={{
              background: "linear-gradient(90deg, #14A9F2, #2AF1E8)",
              borderRadius: 999,
              bottom: 28,
              height: 8,
              left: 18,
              position: "absolute",
              transform: "rotate(-22deg)",
              width: 88
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
