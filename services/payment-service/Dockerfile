FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY services/payment-service/package*.json ./services/payment-service/

RUN cd services/payment-service && npm install

COPY services/payment-service ./services/payment-service
COPY common /app/common

WORKDIR /app/services/payment-service

EXPOSE 3003

CMD ["npm", "start"] 