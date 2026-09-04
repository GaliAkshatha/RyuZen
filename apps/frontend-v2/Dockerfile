# Real multi-stage build, matching this project's actual scripts
# exactly - "build": "tsc -b && vite build" (confirmed against
# package.json), output to dist/, served here by nginx.
#
# VITE_API_BASE_URL is passed as a build ARG rather than a runtime
# env var deliberately - Vite inlines import.meta.env.* values into
# the built JS bundle at build time (confirmed directly against
# apiClient.ts, which reads VITE_API_BASE_URL), so setting this as a
# plain runtime container env var would silently do nothing - the
# value has to be known when `vite build` actually runs.

FROM node:22-slim AS builder
WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage: nginx serving the real static build ----
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
