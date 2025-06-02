// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // ⛔ Skip ESLint build blocking
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ⛔ Skip TS type errors during build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig


// // next.config.js

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // ✅ Your existing configurations go here...

//   // ✅ Allow specific development origins by hostname only
//   allowedDevOrigins: [
//     'affb-60-243-255-160.ngrok-free.app', // ✅ Hostname only, no protocol
//     // Add more if needed, e.g., "*.ngrok-free.app"
//   ],
// }

// module.exports = nextConfig
