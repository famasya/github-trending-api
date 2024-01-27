import { createRoute, z } from "@hono/zod-openapi";

const Response = z.object({
  meta: z.object({
    fetched_at: z.string()
  }),
  repositories: z.array(z.object({
    repository: z.string(),
    url: z.string(),
    description: z.string(),
    language: z.string(),
    stars: z.number(),
    forks: z.number(),
    builtBy: z.array(z.string())
  }))
})

export const ValidPeriod = z.enum(['daily', 'weekly', 'monthly']).optional()

export const route = createRoute({
  method: 'get',
  path: '/trending/{language}',
  description: 'Results are cached for 6 hours. For language list, refers to https://github.com/trending values',
  request: {
    params: z.object({
      language: z.string().default('all')
    }),
    query: z.object({
      period: ValidPeriod
    })
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: Response
        }
      },
      description: "Success response"
    },
  },
})
