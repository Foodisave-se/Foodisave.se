# Använd Node.js 22 som bas
FROM node:22

# Sätt arbetsmappen i containern
WORKDIR /frontend

# Kopiera package.json och package-lock.json
COPY package.json package-lock.json ./

# Installera beroenden
RUN npm install --frozen-lockfile

# Kopiera resten av projektet
COPY . .

# Exponera Vite-standardporten
EXPOSE 5173

# Kör utvecklingsservern
CMD ["npm", "run", "dev", "--", "--host"]
