/** @type {import('next').NextConfig} */
module.exports = {
  serverRuntimeConfig: {
    apiTimeout: 30000, // 30 seconds (adjust as needed)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}
