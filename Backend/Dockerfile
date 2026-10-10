FROM node:20-slim

# Only need openssl for Prisma on Linux
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PORT=4000

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "--max-old-space-size=256", "dist/app.js"]
