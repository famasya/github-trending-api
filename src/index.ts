import { swaggerUI } from "@hono/swagger-ui"
import { OpenAPIHono, z } from "@hono/zod-openapi"
import { zValidator } from "@hono/zod-validator"
import { cache } from "hono/cache"
import { getTrendingData } from "./get-trending-data"
import { ValidPeriod, route } from "./schema"

const app = new OpenAPIHono()

app.get("/", swaggerUI({ url: "/doc" }))

app.use(
  route.getRoutingPath(),
  cache({
    cacheName: "trending-cache",
    cacheControl: "max-age=21600"
  }),
  zValidator("query", z.object({
    period: ValidPeriod
  }))
)

app.openapi(route,
  async (c) => {
    const { language } = c.req.valid("param")
    const period = c.req.query("period")

    const repositories = await getTrendingData(language, period)

    return c.json({
      meta: {
        fetched_at: new Date().toISOString()
      },
      repositories: repositories
    })
  }
)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Github trending API",
  },
})

export default app
