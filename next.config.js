/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pollinations.ai',
      'image.pollinations.ai',
      'replicate.delivery',
      'images.unsplash.com'
    ],
    unoptimized: true, // 对于外部图片源禁用优化
    minimumCacheTTL: 60, // 缓存图片60秒
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
        pathname: '/prompt/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
  // API路由配置
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: false,
  },
  // 增加请求超时时间
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
  // 禁用i18n的SSR功能
  i18n: {
    locales: ['zh-CN', 'en', 'ja', 'ko'],
    defaultLocale: 'zh-CN',
    localeDetection: false, // 禁用Next.js的自动语言检测，使用i18next的检测
  }
}

module.exports = nextConfig 