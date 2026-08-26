FROM node:20-alpine AS base

# Build client
FROM base AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build server
FROM base AS server-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npx tsc

# Production image
FROM base AS production
WORKDIR /app

COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./client/dist
COPY server/package.json ./server/

RUN cd server && npm install prisma --save-dev 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "cd server && npx prisma db push --skip-generate --schema=prisma/schema.prisma && cd .. && node server/dist/index.js"]
