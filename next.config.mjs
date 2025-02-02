/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    env: {
      HYDRA_PUBLIC_ENDPOINT: process.env.HYDRA_PUBLIC_ENDPOINT,
      HYDRA_REDIRECT_URL: process.env.HYDRA_REDIRECT_URL,
      HYDRA_CLIENT_ID: process.env.HYDRA_CLIENT_ID,
      HYDRA_CLIENT_SECRET: process.env.HYDRA_CLIENT_SECRET,
    },
    reactStrictMode: false,
};

export default nextConfig;
