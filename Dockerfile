# LogicsGrid website (TanStack Start, Node server) for Dokploy.
# Serves on port 3000. Content comes from the CMS at VITE_CMS_URL (default
# https://backend.logicsgrid.org; override with a build argument if it moves).
# It is baked into the build, so redeploy the site if that URL changes.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install --no-package-lock --no-audit --no-fund

COPY . .
ARG VITE_CMS_URL=https://backend.logicsgrid.org
ENV VITE_CMS_URL=$VITE_CMS_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
