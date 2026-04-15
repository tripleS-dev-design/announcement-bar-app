FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000
WORKDIR /app
ENV NODE_ENV=production

# Copie des dépendances
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Installation sans scripts automatiques
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
RUN npm remove @shopify/cli || true

# Copie du code
COPY . .

# Génération Prisma
RUN npx prisma generate

# Build Remix
RUN npm run build

# --- NOUVEAU : Script de démarrage avec pause infinie en cas d'erreur ---
RUN echo '#!/bin/sh' > /app/start-debug.sh && \
    echo 'echo "=== DEMARRAGE DU SCRIPT ==="' >> /app/start-debug.sh && \
    echo 'npm run docker-start 2>&1 | tee /app/debug.log' >> /app/start-debug.sh && \
    echo 'EXIT_CODE=$?' >> /app/start-debug.sh && \
    echo 'echo "=== FIN DU SCRIPT (exit code: $EXIT_CODE) ===" | tee -a /app/debug.log' >> /app/start-debug.sh && \
    echo 'echo "Le conteneur va rester en vie pour inspection. Appuyez sur Ctrl+C pour quitter."' >> /app/start-debug.sh && \
    echo 'tail -f /dev/null' >> /app/start-debug.sh && \
    chmod +x /app/start-debug.sh

CMD ["/app/start-debug.sh"]
