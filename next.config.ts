import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    // Each device gets a copy resized for its screen by our /img route, in the original format
    // (JPEG stays JPEG at quality 90, never WebP): light to load, same look.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    qualities: [90],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      { pathname: '/brand/**' },
      { pathname: '/images/**' },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
