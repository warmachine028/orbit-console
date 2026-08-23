/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [{ source: '/((?!api|_next|favicon.ico).*)', destination: '/' }]
  },
}

export default nextConfig
