import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   productionBrowserSourceMaps: false,
//   webpack(config:any) {
//     // Disable source map parsing for node_modules
//     config.devtool = false;
//     return config;
//   }
// };

// module.exports = nextConfig;
