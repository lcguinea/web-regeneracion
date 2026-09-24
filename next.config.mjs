/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/', destination: '/es', permanent: true },
      { source: '/contacto', destination: '/es/contacto', permanent: true },
    ];
  },
};
export default nextConfig;
