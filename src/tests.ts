import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { ServerRouter } from "../mod.ts";

const router = new ServerRouter();

router
  .route("/", (_req) => new Response("Hello World!"))
  .route("/api/hi", (_req) => new Response("Hi, API!"))
  .route("/api/", (_req) => new Response("Some API"));

const { port }: { hostname: string; port: number } = await new Promise(
  (resolve) => serve(router.handler, { onListen: resolve }),
);

const url = `http://localhost:${port}`;

Deno.test("test router", async () => {
  const root = await fetch(`${url}/`)
    .then((res) => res.text());

  assertEquals(root, "Hello World!");

  const api = await fetch(`${url}/api/`)
    .then((res) => res.text());

  assertEquals(api, "Some API");

  const apiHi = await fetch(`${url}/api/hi`)
    .then((res) => res.text());

  assertEquals(apiHi, "Hi, API!");
});
