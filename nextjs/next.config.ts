// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Your existing configurations go here...

  // ✅ Allow specific development origins by hostname only
  allowedDevOrigins: [
    "ec59-60-243-255-160.ngrok-free.app", // ✅ Hostname only, no protocol
    // Add more if needed, e.g., "*.ngrok-free.app"
  ],
};

module.exports = nextConfig;
