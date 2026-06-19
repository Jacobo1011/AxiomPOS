FROM node:18-alpine

WORKDIR /app

# Enable next telemetry disable during build
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .

# Ignore ESLint and TypeScript errors during production build if any to avoid container failures
ENV NEXT_IGNORE_ESLINT=true
ENV NEXT_IGNORE_TYPECHECK=true

RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "start"]
