FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000
WORKDIR /app
ENV NODE_ENV=production

# --- Définir les arguments de build (reçus de fly.toml) ---
ARG SHOPIFY_APP_URL
ARG HOST

# --- Les transformer en variables d'environnement pour le build ---
ENV SHOPIFY_APP_URL=${SHOPIFY_APP_URL}
ENV HOST=${HOST}

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Installer les dépendances
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
RUN npm remove @shopify/cli || true

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# --- Lancer le build Remix AVEC les variables définies ---
RUN npm run build

# --- Script de démarrage (debug temporaire) ---
RUN echo '#!/bin/sh' > /app/start-debug.sh && \
    echo 'echo "=== DEMARRAGE DU SCRIPT ==="' >> /app/start-debug.sh && \
    echo 'echo "=== TOUTES LES VARIABLES D ENVIRONNEMENT ==="' >> /app/start-debug.sh && \
    echo 'env | sort' >> /app/start-debug.sh && \
    echo 'npm run docker-start 2>&1 | tee /app/debug.log' >> /app/start-debug.sh && \
    echo 'EXIT_CODE=$?' >> /app/start-debug.sh && \
    echo 'echo "=== FIN DU SCRIPT (exit code: $EXIT_CODE) ===" | tee -a /app/debug.log' >> /app/start-debug.sh && \
    echo 'tail -f /dev/null' >> /app/start-debug.sh && \
    chmod +x /app/start-debug.sh

CMD ["/app/start-debug.sh"]
