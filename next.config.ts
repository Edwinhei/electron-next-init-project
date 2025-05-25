// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: './', // 确保这个是 './' 或 '.'
  // 移除整个 experimental 配置块，因为我们不再使用 next/font
};

export default nextConfig;