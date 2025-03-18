# E-Ticaret Mikroservis Platformu

## 📋 Proje Hakkında
Bu proje, modern e-ticaret sistemlerinin ihtiyaçlarını karşılamak üzere tasarlanmış, mikroservis mimarisi kullanan bir platformdur. Kullanıcı yönetimi, ürün yönetimi, sipariş işlemleri ve ödeme işlemleri gibi temel e-ticaret fonksiyonlarını bağımsız servisler halinde sunar.

## 🏗️ Sistem Mimarisi
Proje, birbirleriyle RabbitMQ üzerinden haberleşen 4 temel mikroservisten oluşmaktadır:

- **User Service** (Port: 3001): Kullanıcı yönetimi ve kimlik doğrulama
- **Product Service** (Port: 3002): Ürün kataloğu yönetimi
- **Order Service** (Port: 3003): Sipariş işlemleri
- **Payment Service** (Port: 3004): Ödeme işlemleri

## 🛠️ Kullanılan Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- RabbitMQ
- JWT (JSON Web Tokens)

### DevOps & Araçlar
- Docker
- Docker Compose
- Git

### Paket Yöneticisi
- npm

## 📦 Bağımlılıklar
- amqplib: ^0.10.5
- bcryptjs: ^2.4.3
- cors: ^2.8.5
- dotenv: ^16.4.1
- express: ^4.18.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.1.1
- winston: ^3.17.0

## 🚀 Kurulum

### Ön Gereksinimler
- Docker ve Docker Compose
- Node.js (v18 veya üzeri)
- npm (v8 veya üzeri)
- Git

### Kurulum Adımları

1. Projeyi klonlayın:
```bash
git clone [proje-url]
cd [proje-klasörü]
```

2. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

3. Docker containerlarını başlatın:
```bash
docker-compose up --build
```

## 🌐 API Endpoints

### User Service (3001)
- POST /api/users/register - Kullanıcı kaydı
- POST /api/users/login - Kullanıcı girişi
- PUT /api/users/profile - Kullancı güncelleme
- GET /api/users/profile - Kullanıcı listele

### Product Service (3002)
- GET /api/products - Ürünleri listele
- POST /api/products - Yeni ürün ekle
- GET api/products/:id -ID'ye göre ürün getir
- PUT /api/products/:id - Ürün güncelle
- DELETE /api/products/:id - Ürün sil

### Order Service (3003)
- POST /api/orders - Sipariş oluştur
- GET /api/orders - Siparişleri listele
- GET /api/orders/:orderId - Sipariş detayını getir
- GET /api/orders/user/:userId - Kullanıcının siparişlerini listele
- PUT /api/orders/:orderId/status - Sipariş durumu güncelle
- DELETE /api/orders/orderId - Sipariş sil
  

### Payment Service (3004)
- POST /api/payments - Ödeme işlemi başlat
- GET /api/payments/:id - ID'ye göre ödeme getir
- GET /api/payment/order/:orderId - Sipariş ID'sine göre ödemeleri getir
- GET /api/payment/user/:userId - Kullanıcı ID'sine göre ödemeleri getir


## 📊 Veritabanı Şeması

Her servis kendi MongoDB veritabanını kullanır:
- user-service
- product-service
- order-service
- payment-service

## 🔄 Message Queue Yapısı

RabbitMQ üzerinde kullanılan exchange ve kuyruklar:
- Exchange: order_events (topic)
- Routing Keys:
  - order.created
  - order.updated
  - order.deleted

## 🛡️ Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifrelenmiş kullanıcı parolaları (bcrypt)
- CORS koruması
- Ortam değişkenleri ile hassas bilgi yönetimi

## 🔍 Test

```bash
npm run test
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

[Aydın Can İçiğen] - [icigenaydincan@gmail.com]
