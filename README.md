# Server Router

Server Router is a minimalistic router for Deno. It is designed with web standards in mind, and is intended to be used with the [Deno HTTP server](https://deno.land/std/http/server.ts).

### Example

```ts
import { serve } from "https://deno.land/std/http/server.ts";
import { ServerRouter } from "https://deno.land/x/server_router/mod.ts";

const router = new ServerRouter();

router
  .route("/", (_req) => new Response("Hello World!"))
  .route("/api/hi", (_req) => new Response("Hi, API!"));

await serve(router.handler);
```
