import http from 'node:http'
import { readFile } from 'node:fs/promises'
const port = 4173
http.createServer(async (request, response) => {
  const path = new URL(request.url ?? '/', 'http://localhost').pathname
  if (path !== '/' && path !== '/preview.html') { response.writeHead(404); response.end('Not found'); return }
  try {
    const html = await readFile(new URL('./preview.html', import.meta.url))
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' })
    response.end(html)
  } catch { response.writeHead(500); response.end('Preview unavailable') }
}).listen(port, '127.0.0.1')
