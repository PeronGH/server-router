export class ServerRouter {
  private routerMap: Map<string, ServerHandler> = new Map();
  private isCaseSensitive = false;

  route(path: string, handler: ServerHandler) {
    if (!path.startsWith("/")) throw new Error("Path must start with /");
    this.routerMap.set(path, handler);
    return this;
  }

  caseSensitive(enabled = true) {
    this.isCaseSensitive = enabled;
    return this;
  }

  private handle(req: Request) {
    const { pathname: reqPath } = new URL(req.url);

    const sortedPath = [...this.routerMap.keys()]
      .filter((p) => p.length <= reqPath.length)
      .sort((a, b) => b.length - a.length);

    for (const routerPath of sortedPath) {
      if (
        this.isCaseSensitive
          ? ServerRouter.comparePath(routerPath, reqPath)
          : ServerRouter.comparePath(
            routerPath.toLowerCase(),
            reqPath.toLowerCase(),
          )
      ) {
        return this.routerMap.get(routerPath)!(req);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  private static comparePath(routerPath: string, reqPath: string) {
    if (routerPath === reqPath) return true;
    if (routerPath.endsWith("/") && reqPath.startsWith(routerPath)) return true;
    return false;
  }

  get handler(): ServerHandler {
    return this.handle.bind(this);
  }
}

export type ServerHandler = (req: Request) => Promise<Response> | Response;
