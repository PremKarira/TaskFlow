# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# =========================
# RUNTIME STAGE
# =========================
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

RUN apk add --no-cache postgresql-client

COPY --from=builder /app .

EXPOSE 8080

CMD ["node", "src/app.js"]