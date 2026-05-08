const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()
  : (config) => config;

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['antd', '@ant-design/icons', '@antv/g6'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
