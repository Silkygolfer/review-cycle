/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'zchkrqcmywmtlcwbxpgh.supabase.co',
        }
      ]
    }
  }
  
  export default nextConfig;