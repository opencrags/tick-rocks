# Install dependencies only when needed
FROM node:15.14.0-alpine3.13 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:14.16.1-alpine3.13 AS builder
WORKDIR /app
COPY . .
RUN rm /app/public/config.json
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
