export class ServerRouter {
  private routerMap: Map<string, ServerHandler> = new Map();

  route(path: string, handler: ServerHandler) {
    if (!path.startsWith("/")) throw new Error("Path must start with /");
    this.routerMap.set(path, handler);
    return this;
  }

  private handle(req: Request) {
    const { pathname: reqPath } = new URL(req.url);

    const sortedPath = [...this.routerMap.keys()]
      .filter((p) => p.length <= reqPath.length)
      .sort((a, b) => b.length - a.length);

    for (const routerPath of sortedPath) {
      if (
        reqPath === routerPath ||
        (routerPath.endsWith("/") && reqPath.startsWith(routerPath))
      ) {
        return this.routerMap.get(routerPath)!(req);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  get handler(): ServerHandler {
    return this.handle.bind(this);
  }
}

export type ServerHandler = (req: Request) => Promise<Response> | Response;
