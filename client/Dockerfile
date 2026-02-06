# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

#Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist

# serve runs on 3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
