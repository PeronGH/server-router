export class ServerRouter {
  private routerMap: Map<string, ServerHandler> = new Map();

  route(path: string, handler: ServerHandler) {
    if (!path.startsWith("/")) throw new Error("Path must start with /");
    this.routerMap.set(path, handler);
    return this;
  }

  private handle(req: Request) {
    const { pathname } = new URL(req.url);

    const sortedMap = [...this.routerMap]
      .sort(([a], [b]) => b.length - a.length);

    for (const [path, handler] of sortedMap) {
      if (
        pathname === path ||
        (path.endsWith("/") && pathname.startsWith(path))
      ) {
        return handler(req);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  get handler(): ServerHandler {
    return this.handle.bind(this);
  }
}

export type ServerHandler = (req: Request) => Promise<Response> | Response;
