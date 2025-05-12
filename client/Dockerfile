# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .


# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY docker/nginx/ssl /etc/nginx/ssl

# Create necessary directories
RUN mkdir -p /var/log/nginx/ && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chmod -R 755 /var/log/nginx/

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
