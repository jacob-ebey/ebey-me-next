module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { dev, isServer }) => {
    // replace react with preact only in client production builds
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    if (!dev && !isServer && process.env.ANALYZE === "true") {
      config.plugins.push(
        new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()
      );
    }

    return config;
  },
};
