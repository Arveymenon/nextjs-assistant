/** @type {import('next').NextConfig} */
module.exports = {
  serverRuntimeConfig: {
    apiTimeout: 30000, // 30 seconds (adjust as needed)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1d04qsc3emydkcwe.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}
