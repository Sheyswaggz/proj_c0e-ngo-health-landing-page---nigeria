# ============================================================================
# Multi-stage Dockerfile for NGO Health Landing Page
# ============================================================================
# Stage 1: Base nginx image with security hardening
# ============================================================================
FROM nginx:1.29-alpine AS base

# Create necessary directories and set permissions using existing nginx user
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

# ============================================================================
# Stage 2: Copy application files
# ============================================================================
FROM base AS app

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static website files
COPY --chown=nginx:nginx index.html ./
COPY --chown=nginx:nginx css/ ./css/
COPY --chown=nginx:nginx js/ ./js/
COPY --chown=nginx:nginx assets/ ./assets/

# Copy custom nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# ============================================================================
# Stage 3: Final production image
# ============================================================================
FROM app AS production

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================================================
# Metadata
# ============================================================================
LABEL maintainer="NGO Health Team"
LABEL description="NGO Health Landing Page - Static Website"
LABEL version="1.0.0"