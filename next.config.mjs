// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    compiler: {
        styledComponents: true,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{loader: '@svgr/webpack', options: {dimensions: false}}],
        });

        return config;
    },
};

export default nextConfig;
