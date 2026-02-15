/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 15 enables the App Router by default; keep other settings here.
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    // Rewrite known category slugs to the existing category route
    const slugs = [
      'aarti',
      'bhajan',
      'chalisa',
      'mantra',
      'stotra',
      'stuti',
      'shloka',
      'ek-shloki',
      'ashtaka',
      'sahasranama',
      'path',
      'namavali',
      '108-namavali',
      'kavacham',
      'prarthana',
      'vrat-katha',
      'rashi',
      'vastu',
      'durga',
      'kuber',
      'other',
    ];
    return slugs.map((slug) => ({
      source: `/devotionals/${slug}`,
      destination: `/devotionals/category/${slug}`,
    }));
  },
}

module.exports = nextConfig
