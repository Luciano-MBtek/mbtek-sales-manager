/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "www.mbtek.com",
        port: "",
        pathname: "/cdn/shop/files/**",
      },
      {
        protocol: "https",
        hostname: "api-na1.hubspot.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "quickchart.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
