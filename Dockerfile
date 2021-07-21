# Install dependencies only when needed
FROM node:16.5.0-alpine3.13 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16.5.0-alpine3.13 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
