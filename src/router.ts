export class ServerRouter {
  private routerMap: Map<string, ServerHandler> = new Map();

  route(path: string, handler: ServerHandler) {
    if (!path.startsWith("/")) throw new Error("Path must start with /");
    this.routerMap.set(path, handler);
    return this;
  }

  handle(req: Request): Promise<Response> {
    const { url } = req;
    const { pathname } = new URL(url);

    const sortedMap = [...this.routerMap].sort(([a], [b]) =>
      b.length - a.length
    );

    for (const [path, handler] of sortedMap) {
      if (matchPath(pathname, path)) {
        return handler(req);
      }
    }

    return Promise.resolve(new Response("Not Found", { status: 404 }));
  }
}

export type ServerHandler = (req: Request) => Promise<Response>;

function matchPath(path: string, pattern: string) {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if (patternParts.length !== pathParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === "*") continue;
    if (patternParts[i] !== pathParts[i]) return false;
  }

  return true;
}
