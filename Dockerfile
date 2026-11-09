# LogicsGrid website (TanStack Start, Node server) for Dokploy.
# Serves on port 3000. Pass the CMS's public URL as a build argument:
#   VITE_CMS_URL=https://admin.example.com
# It is baked into the build, so redeploy the site if that URL changes.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install --no-package-lock --no-audit --no-fund

COPY . .
ARG VITE_CMS_URL
ENV VITE_CMS_URL=$VITE_CMS_URL
RUN test -n "$VITE_CMS_URL" || (echo "Set the VITE_CMS_URL build argument" && exit 1)
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
