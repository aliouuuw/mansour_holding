FROM oven/bun:1 AS base
WORKDIR /app

# Copy workspace config
COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all dependencies
RUN bun install --frozen-lockfile

# Start the API
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
