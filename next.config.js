module.exports = {
  distDir: 'build',
  output: process.env.NEXT_BUILD_TYPE ?? 'standalone',
  images: {
    // disable static image optimization for export builds
    unoptimized: process.env.NEXT_BUILD_TYPE === 'export',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  ...(process.env.NODE_ENV === 'production'
    ? {
        eslint: {
          ignoreDuringBuilds: true,
        },
        typescript: {
          tsconfigPath: 'tsconfig.build.json',
        },
      }
    : {}),
};
