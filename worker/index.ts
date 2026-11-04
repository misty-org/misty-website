// The website's Worker. Every request is a static file or the single-page app, except
// `/docs` addresses (see `run_worker_first` in wrangler.jsonc): the docs live at
// docs.mistysys.com, so those move there for good.

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const DOCS_HOST = "docs.mistysys.com";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const docsPath = url.pathname.replace(/^\/docs(?=\/|$)/, "");
    if (docsPath !== url.pathname) {
      return Response.redirect(`https://${DOCS_HOST}${docsPath || "/"}${url.search}`, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
