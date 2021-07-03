Webpack Module Federation has been a game changer in the micro-frontend space allowing multiple SPA's to operate as one cohecive bundle. This has also enabled separately bundled and deployed SSR'd applications to make client side transitioning between them just as seamless as if they were bundled and deployed together.

The missing piece comes when you want to SSR and share at a more granular level than the "page". There are two solutions to this problem, code streaming, and pre-render services. Code streaming has been gaining attention but I would like to focus on how we can solve this with an auto generated prerender service using webpack.

**TLDR;**

1. Auto-generate a pre-render route handler as a virtual module you can include in a server route
2. Use react 18 lazy or a pre-pass solution to collect federated components you are rendering
3. Do a POST call to the remote's auto-generated pre-render route to gather the SSR'd HTML
4. Replace children placeholder with the children the host's useage may have rendered
5. Add style tags and optionally lazy load scripts for remote components
6. On hydration consume federated component from remote as usual (might need a hack to preserve HTML while loading if not using react 18)
