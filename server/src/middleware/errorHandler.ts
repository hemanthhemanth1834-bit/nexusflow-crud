import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' })
}
