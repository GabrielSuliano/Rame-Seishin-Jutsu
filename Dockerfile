FROM node:24.14.0-bookworm-slim
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --prefix backend --omit=dev

COPY package.json ./
COPY scripts/ ./scripts/
COPY src/ ./src/
RUN npm run build

COPY backend/ ./backend/

ENV NODE_ENV=production
ENV PORT=3000
USER node
EXPOSE 3000
WORKDIR /app/backend
CMD ["node", "servidor.js"]
