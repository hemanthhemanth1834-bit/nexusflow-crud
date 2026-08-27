import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import recordsRouter from './routes/records.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json())

app.use('/api/records', recordsRouter)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
