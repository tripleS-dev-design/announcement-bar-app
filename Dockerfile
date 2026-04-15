FROM node:20-alpine
RUN apk add --no-cache openssl

# Fly.io utilise le port 8080 par défaut, mais votre app écoute sur 3000 ou PORT
EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
# ⚠️ Prisma a besoin du dossier prisma pour le script prepare, on le copie tout de suite
COPY prisma ./prisma

# Installer les dépendances SANS lancer les scripts (pour éviter prisma generate trop tôt)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Supprimer le CLI Shopify (optionnel)
RUN npm remove @shopify/cli

# Copier le reste du code source
COPY . .

# Lancer prisma generate maintenant que tout est là
RUN npx prisma generate

# Builder l'application Remix
RUN npm run build

# Commande de démarrage
CMD ["npm", "run", "docker-start"]
