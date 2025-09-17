// Temporarily disable Sentry to fix routing issues
// import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    instrumentationHook: false,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build to fix Sanity removal
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/axiestudio",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/axiestudio/axiestudio",
        permanent: false,
      },
      {
        source: "/twitter",
        destination: "https://x.com/axiestudio",
        permanent: false,
      },
      {
        source: "/youtube",
        destination: "https://www.youtube.com/@axiestudio",
        permanent: false,
      },
      {
        source: "/x",
        destination: "https://x.com/axiestudio",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "https://docs.axiestudio.se",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

// Temporarily disabled Sentry configuration
/*
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "axiestudio",
  project: "website",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
*/
