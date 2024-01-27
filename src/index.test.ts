import type { UnstableDevWorker } from "wrangler";
import { unstable_dev } from "wrangler";

describe("GET /trending", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return all trending", async () => {
    const resp = await worker.fetch("/trending/all");
    const text = await resp.json() as { repositories: object[] };
    expect(text).toHaveProperty("repositories");
    expect(text.repositories.length).toBeGreaterThan(0)
  });

  it("should return cached results", async () => {
    const resp = await worker.fetch("/trending/all");
    expect(resp.headers.get('cf-cache-status')).toBe("HIT");
  });

  it("should fails (wrong param)", async () => {
    const resp = await worker.fetch("/trending/all?period=annually");
    expect(resp.status).toBe(400);
  });
});
