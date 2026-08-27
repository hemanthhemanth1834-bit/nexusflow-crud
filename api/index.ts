import 'dotenv/config'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { app } from '../server/src/app.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    app(req as never, res as never, (err) => {
      if (err) {
        console.error('Vercel handler error:', err)
        res.status(500).json({ error: 'Internal server error' })
        reject(err)
        return
      }
      resolve()
    })
  })
}
