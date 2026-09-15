# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
