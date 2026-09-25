const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  // "redirects" is incompatible with "output: export" (GitHub Pages build);
  // that build relies on the static public/index.html and public/contacto.html instead.
  ...(isStaticExport
    ? { output: 'export', trailingSlash: true }
    : {
        async redirects() {
          return [
            { source: '/', destination: '/es', permanent: true },
            { source: '/contacto', destination: '/es/contacto', permanent: true },
          ];
        },
      }),
};
export default nextConfig;
