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
      if (
        pathname === path ||
        (path.endsWith("/") && pathname.startsWith(path))
      ) {
        return handler(req);
      }
    }

    return Promise.resolve(new Response("Not Found", { status: 404 }));
  }
}

export type ServerHandler = (req: Request) => Promise<Response>;
