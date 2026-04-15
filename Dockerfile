FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000
WORKDIR /app
ENV NODE_ENV=production

# --- Arguments de build (reçus de fly.toml) ---
ARG SHOPIFY_APP_URL
ARG HOST
ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SCOPES

# --- Création d'un fichier .env pour que Remix et le SDK Shopify le lisent ---
RUN echo "SHOPIFY_APP_URL=${SHOPIFY_APP_URL}" > .env && \
    echo "HOST=${HOST}" >> .env && \
    echo "SHOPIFY_API_KEY=${SHOPIFY_API_KEY}" >> .env && \
    echo "SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}" >> .env && \
    echo "SCOPES=${SCOPES}" >> .env

# --- Définition des variables d'environnement pour le build ---
ENV SHOPIFY_APP_URL=${SHOPIFY_APP_URL}
ENV HOST=${HOST}
ENV SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
ENV SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
ENV SCOPES=${SCOPES}

# Copie des dépendances
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Installation sans scripts automatiques
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
RUN npm remove @shopify/cli || true

# Copie du code source
COPY . .

# Génération Prisma
RUN npx prisma generate

# Build Remix (avec le .env présent)
RUN npm run build

# Script de démarrage (temporaire pour debug)
RUN echo '#!/bin/sh' > /app/start-debug.sh && \
    echo 'echo "=== DEMARRAGE DU SCRIPT ==="' >> /app/start-debug.sh && \
    echo 'npm run docker-start' >> /app/start-debug.sh && \
    chmod +x /app/start-debug.sh

CMD ["/app/start-debug.sh"]
