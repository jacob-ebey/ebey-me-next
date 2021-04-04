const path = require("path");

const withTM = require("next-transpile-modules")(
  ["@ebey-me/react-edge-personalization-next-app/pages/index"],
  {
    resolveSymlinks: true,
  }
);

module.exports = withTM({
  future: {
    webpack5: true,
  },
  webpack: (config, { dev, isServer }) => {
    Object.assign(config.resolve.alias, {
      "@ebey-me/react-edge-personalization-next-app/pages/index": path.resolve(
        "../",
        "examples/react-edge-personalization/next-app/pages/index.jsx"
      ),
    });

    // replace react with preact only in client production builds
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    if (dev) {
      config.plugins.push(
        new (require("webpack-watch-files-plugin").default)({
          files: ["./blog/*.mdx"],
        })
      );
    }

    if (!dev && !isServer && process.env.ANALYZE === "true") {
      config.plugins.push(
        new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()
      );
    }

    return config;
  },
});
