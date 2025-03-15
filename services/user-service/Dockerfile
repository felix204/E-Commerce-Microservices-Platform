FROM node:18-alpine

WORKDIR /app

# Önce package.json dosyasını kopyalayalım
COPY services/user-service/package*.json ./

# Bağımlılıkları yükleyelim
RUN npm install

# Servis kodlarını kopyalayalım
COPY services/user-service .

# Common klasörünü kopyalayalım
COPY common /app/common

EXPOSE 3001

CMD ["node", "server.js"]