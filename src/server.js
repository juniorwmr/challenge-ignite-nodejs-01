import { Server } from 'node:http'
import { routes } from './routes.js'
import { json } from './middlewares/json.js'
import { httpResponse } from './utils/http-response.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = new Server(async (req, res) => {
  const { url, method } = req
  const route = routes.find(route => route.path.test(url) && route.method === method)
  await json(req, res)

  if (route) {
    const { query, ...params } = req.url.match(route.path).groups
    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    return route.handler(req, res)
  }
  return httpResponse(res, 404, { error: 'Not found' })
})

server.listen(3333, () => {
  console.log('Server is running')
})