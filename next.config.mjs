// Next.js config.
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,

  // Safe security headers applied to every response. These are the low-risk,
  // high-value ones — they won't break a starter app.
  // NOTE: a Content-Security-Policy is deliberately NOT set here. A strict CSP
  // is powerful but easy to get wrong (it can silently break inline styles and
  // scripts), so add one only when you understand it — see Next.js docs.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop the browser guessing/over-riding declared content types.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Block your site from being embedded in someone else's <iframe>.
          { key: "X-Frame-Options", value: "DENY" },
          // Don't leak the full URL (with query params) to other sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Turn off powerful browser features you don't use.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
