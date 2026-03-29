FROM node:22-alpine3.22 AS base

FROM base AS deps
WORKDIR /application_tracker
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

FROM base AS builder
WORKDIR /application_tracker
COPY --from=deps /application_tracker/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS migrator
WORKDIR /application_tracker
COPY --from=deps /application_tracker/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./

FROM base AS runner
WORKDIR /application_tracker
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /application_tracker/public ./public
COPY --from=builder /application_tracker/.next/standalone ./
COPY --from=builder /application_tracker/.next/static ./.next/static

EXPOSE 3000

CMD ["sh", "-c", "node server.js"]
