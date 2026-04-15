FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000
WORKDIR /app
ENV NODE_ENV=production

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Installation sans exécuter les scripts
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
RUN npm remove @shopify/cli || true

# Copie du reste du code
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Build Remix
RUN npm run build

# --- Modification clé : on lance un script de debug qui loggue tout ---
RUN echo '#!/bin/sh' > /app/start-debug.sh && \
    echo 'echo "=== DEMARRAGE DU SCRIPT ==="' >> /app/start-debug.sh && \
    echo 'npm run docker-start 2>&1 | tee /app/debug.log' >> /app/start-debug.sh && \
    echo 'echo "=== FIN DU SCRIPT (exit code: $?) ==="' >> /app/debug.log && \
    chmod +x /app/start-debug.sh

CMD ["/app/start-debug.sh"]
