# 1. Building Stage
FROM node:18-alpine AS builder

# set proxy node settings
RUN npm config set proxy http://proxy.th-wildau.de:8080 && \
    npm config set https-proxy http://proxy.th-wildau.de:8080

WORKDIR /app

# copy dependencies
COPY package.json package-lock.json* ./

# install dependencies
RUN npm install

# copy rest of the project
COPY . .

RUN npm run build

# 2. Production Stage
FROM node:18-alpine

# set proxy in system
ENV http_proxy=http://proxy.th-wildau.de:8080 \
    https_proxy=http://proxy.th-wildau.de:8080

WORKDIR /app

# copy node_modules, app and code from stage 1
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/config.ts ./config.ts
COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["npm", "start"]
