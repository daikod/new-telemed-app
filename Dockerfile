# Build stage for React frontend
FROM node:16 AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for Node.js backend
FROM node:16
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
COPY --from=frontend-build /app/client/build ./public

EXPOSE 5000
CMD ["npm", "start"] 