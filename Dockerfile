FROM nginx:1.27-alpine

LABEL maintainer="NGO Health Landing Page Team" \
      version="1.0.0" \
      description="Static landing page for NGO Health - Nigeria"

RUN addgroup -g 1001 -S nginx && \
    adduser -S -u 1001 -G nginx nginx && \
    mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

WORKDIR /usr/share/nginx/html

COPY --chown=nginx:nginx index.html ./
COPY --chown=nginx:nginx css/ ./css/
COPY --chown=nginx:nginx js/ ./js/
COPY --chown=nginx:nginx assets/ ./assets/

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

RUN chmod -R 755 /usr/share/nginx/html && \
    chmod 644 /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]