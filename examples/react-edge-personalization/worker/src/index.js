import { parse, quoteattr, stringify, walk } from "./html-utils";

const OriginUrl =
  typeof ORIGIN_URL !== "undefined" ? ORIGIN_URL : "http://localhost:3000";

import { loadPersonalizationPayloads } from "./personalization-service";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * @param {Request} request
 */
function handleRequest(request) {
  const requestUrl = new URL(request.url);
  const originUrl = new URL(requestUrl.pathname, OriginUrl);
  originUrl.search = requestUrl.search;

  const originRequest = new Request(originUrl.toString(), {
    method: request.method,
    headers: request.headers,
  });

  return fetch(originRequest)
    .then(handleOriginResponse)
    .catch((err) => {
      console.error("Internal Service Error", err);
      return new Response("Internal Service Error", { status: 500 });
    });
}

/**
 * @param {Response} originResponse
 */
async function handleOriginResponse(originResponse) {
  if (
    !originResponse.ok ||
    !originResponse.headers.get("content-type").includes("html")
  ) {
    return originResponse;
  }
  // store copy of the response for fallback
  const fallbackResponse = originResponse.clone();

  try {
    const html = await originResponse.text();

    const hasDoctype = html.startsWith("<!DOCTYPE html>");

    let parsedHtml = hasDoctype ? html.replace("<!DOCTYPE html>", "") : html;
    const ast = parse(parsedHtml);

    const nodesToPersonalize = [];

    // Walk and collect personalizable nodes
    walk(ast, {
      div: (node) => {
        if (node.attrs["personalizable-name"]) {
          nodesToPersonalize.push(node);
        }
      },
    });

    // Load the payloads for those nodes
    const payloads = loadPersonalizationPayloads(
      Array.from(
        new Set(
          nodesToPersonalize.map((node) => node.attrs["personalizable-name"])
        )
      )
    );

    // Remote components that were used to personalize
    const remoteComponents = [];

    await Promise.all(
      nodesToPersonalize.map(async (node) => {
        const pname = node.attrs["personalizable-name"];
        const payload = payloads[pname];

        // If there was no payload for this node, we are done
        if (!payload) {
          return;
        }

        // If we are personalizing with a remote component
        if (payload.remoteComponent && payload.remoteComponent.remote) {
          // Prerender the component to HTML
          const prerenderRes = await fetch(
            payload.remoteComponent.remote.prerender,
            {
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                component: payload.remoteComponent.module,
                props: payload.props || {},
              }),
            }
          );

          if (!prerenderRes.ok) {
            return;
          }

          // Store the remote component for preload
          remoteComponents.push(payload.remoteComponent);

          // Replace the content with the prerendered HTML
          const prerenderHtml = parse(await prerenderRes.text());
          node.children = prerenderHtml;
          node.attrs["personalizable-payload"] = quoteattr(
            JSON.stringify(payload)
          );
        }
      })
    );

    // Dedupe remote stat loading
    const loadRemoteStatsPromises = {};
    const loadRemoteStats = (url) => {
      loadRemoteStatsPromises[url] =
        loadRemoteStatsPromises[url] || fetch(url).then((res) => res.json());

      return loadRemoteStatsPromises[url];
    };

    // Collect all the stats for the remotes
    const remotesStats = {};
    await Promise.all(
      remoteComponents.map(async (remoteComponent) => {
        if (!remoteComponent.remote.stats) {
          return;
        }

        const remoteStats = await loadRemoteStats(remoteComponent.remote.stats);
        if (remoteStats && remoteStats.federatedModules) {
          const moduleStats = remoteStats.federatedModules.find(
            (module) => module.remote === remoteComponent.remote.name
          );
          remotesStats[remoteComponent.remote.name] = moduleStats;
        }
      })
    );

    // Add preload tags to the head
    const preloadedRemotes = new Set();
    walk(ast, {
      head: (node) => {
        remoteComponents.forEach((remoteComponent) => {
          // Add the remote entires preload tags
          if (!preloadedRemotes.has(remoteComponent.remote.name)) {
            preloadedRemotes.add(remoteComponent.remote.name);
            node.children.push({
              type: "tag",
              name: "link",
              voidElement: true,
              attrs: {
                rel: "preload",
                as: "script",
                href: remoteComponent.remote.url,
                "personalizable-preload": remoteComponent.remote.name,
              },
            });
          }

          const remoteStats = remotesStats[remoteComponent.remote.name];
          // If there are stats for the remote entry
          if (
            remoteStats &&
            remoteStats.exposes &&
            remoteStats.exposes[remoteComponent.module]
          ) {
            const moduleStats = remoteStats.exposes[remoteComponent.module];

            // If there are stats for the module in the remote entry
            if (moduleStats) {
              // Get the base url for the chunks of the remote entry
              const remoteBaseUrl = remoteComponent.remote.url.substring(
                0,
                remoteComponent.remote.url.lastIndexOf("/")
              );

              moduleStats
                // Flatten out the chunks that the remote module relies on
                .reduce((p, c) => [...p, ...c.chunks], [])
                .forEach((chunk) => {
                  const href = `${remoteBaseUrl}/${chunk}`;
                  // Add the remote module chunk preload tags
                  if (!preloadedRemotes.has(href)) {
                    preloadedRemotes.add(href);

                    node.children.push({
                      type: "tag",
                      name: "link",
                      voidElement: true,
                      attrs: {
                        rel: "preload",
                        as: chunk.endsWith(".css") ? "style" : "script",
                        href,
                      },
                    });
                  }
                });
            }
          }
        });
      },
    });

    // Stringify the HTML ast and send it to the client
    const personalizedHtml = stringify(ast);
    const finalHtml = hasDoctype
      ? `<!DOCTYPE html>${personalizedHtml}`
      : personalizedHtml;

    return new Response(finalHtml, originResponse);
  } catch (err) {
    console.error(err);
    return fallbackResponse;
  }
}
