FROM node:20-alpine

WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY frontend /app/frontend

EXPOSE 4000
CMD ["node", "src/server.js"]
