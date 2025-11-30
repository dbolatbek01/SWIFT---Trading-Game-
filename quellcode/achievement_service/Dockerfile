# 1. Bulding Stage 
FROM node:18-alpine AS builder

# set proxy node settings
RUN npm config set proxy http://proxy.th-wildau.de:8080 && \
    npm config set https-proxy http://proxy.th-wildau.de:8080

WORKDIR /app
 
COPY package.json package-lock.json* ./

RUN npm install

# 2. Production Stage
FROM node:18-alpine

# set timezone and proxy in system
ENV http_proxy=http://proxy.th-wildau.de:8080 \
    https_proxy=http://proxy.th-wildau.de:8080

WORKDIR /app

# copy node_modules and code from stage 1
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# copy rest of the projekt
COPY . .

EXPOSE 5001
CMD ["node", "server.js"]
