const PERSONALIZATIONS = {
  "login-message": {
    remoteComponent: {
      remote: {
        name: "test",
        stats:
          "https://federated-container-action.vercel.app/static/client/federation-stats.json",
        url:
          "https://federated-container-action.vercel.app/static/client/test.js",
        prerender: "https://federated-container-action.vercel.app/",
      },
      module: "./hero-component",
    },
  },
};

export function loadPersonalizationPayloads(names) {
  return PERSONALIZATIONS;
}
