# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# the app ships no static assets, so public/ may be absent — ensure it exists
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- run (standalone) ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# bind to all interfaces (Docker sets HOSTNAME to the container id, which the
# Next standalone server would otherwise bind to → unreachable behind Render)
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN mkdir -p /data && chown nextjs:nodejs /data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
# NOTE: no VOLUME — an anonymous volume makes /data root-owned at runtime, which
# blocks admin saves on the Free plan. With a real Render/Railway disk mounted at
# /data this isn't needed. /data stays writable by the nextjs user either way.
# force bind to 0.0.0.0 at the process level (overrides any injected HOSTNAME)
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
