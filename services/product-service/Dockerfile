FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY services/product-service/package*.json ./services/product-service/

RUN cd services/product-service && npm install

COPY services/product-service ./services/product-service
COPY common /app/common

WORKDIR /app/services/product-service

EXPOSE 3002

CMD ["npm", "start"] 