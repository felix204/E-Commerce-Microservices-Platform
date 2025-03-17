FROM node:18-alpine

WORKDIR /app

# Önce package.json dosyasını kopyalayalım
COPY services/order-service/package*.json ./

# Bağımlılıkları yükleyelim
RUN npm install

# Servis kodlarını kopyalayalım
COPY services/order-service .

# Common klasörünü kopyalayalım
COPY common /app/common

EXPOSE 3004

CMD ["node", "server.js"]