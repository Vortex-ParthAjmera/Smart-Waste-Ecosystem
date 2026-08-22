/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@sgv/contracts", "@sgv/rules-engine"],
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
