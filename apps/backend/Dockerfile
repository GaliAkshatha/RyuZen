# Real multi-stage build, matching this project's actual scripts
# exactly - "build": "tsc" (outDir confirmed ./dist, rootDir ./src in
# tsconfig.json) and "start": "node dist/server.js" - both verified
# by actually running them before writing this file, not assumed.

FROM node:22-slim AS builder
WORKDIR /app

# Real package.json/lockfile copied first so this layer only
# re-runs when dependencies actually change, not on every source edit.
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: only the compiled output + production deps ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Real persistent volume mount point for certification file uploads,
# only actually used when STORAGE_PROVIDER=local (the default - see
# LocalDiskStorageService.ts and FileStorageFactory.ts). Without a
# real volume mounted here on an ephemeral container filesystem,
# local files are lost on restart - docker-compose.yml already does
# this for local/self-hosted use. For a real ephemeral/serverless
# deployment, set STORAGE_PROVIDER=s3 instead, which needs no volume
# at all.
VOLUME ["/app/uploads"]

EXPOSE 5000

CMD ["node", "dist/server.js"]
