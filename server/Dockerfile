# Base image for installing all dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder stage for application code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create non-root user
RUN addgroup -S --gid 1001 appgroup && \
    adduser -S --uid 1001 -G appgroup appuser

# Copy necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/ ./

# Create uploads directory (if needed by the app)
RUN mkdir -p uploads && \
    chown -R appuser:appgroup /app

USER appuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
