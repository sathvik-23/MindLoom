// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Your existing Next.js config options go here...
  reactStrictMode: true,
  experimental: {
    serverActions: true, // if you're using them
  },

  // ✅ Custom field to store allowed development origins by hostname
  allowedDevOrigins: [
    'affb-60-243-255-160.ngrok-free.app', // ✅ Only hostname, no protocol
    // Add more if needed, e.g., 'localhost', '*.ngrok-free.app'
  ],
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
