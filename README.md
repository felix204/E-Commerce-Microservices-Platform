
E-Commerce Microservices Platform
Docker tabanlı e-ticaret mikroservis mimarisi. Bu proje, kullanıcı yönetimi, ürün kataloğu ve ödeme işlemleri için bağımsız servisler içerir.
Proje Yapısı
Servisler
User Service (Port: 3001)
Kullanıcı kaydı ve kimlik doğrulama
JWT tabanlı yetkilendirme
Kullanıcı profil yönetimi
Product Service (Port: 3002)
Ürün kataloğu yönetimi
Ürün arama ve filtreleme
Stok takibi
Payment Service (Port: 3003)
Ödeme işlemleri simülasyonu
Ödeme geçmişi ve durumu
Farklı ödeme yöntemleri desteği
Teknolojiler
Backend: Node.js, Express.js
Veritabanı: MongoDB Atlas
Konteynerizasyon: Docker, Docker Compose
Mimari: Mikroservis Mimarisi
API: RESTful API
Kurulum
Repo'yu klonlayın:
Örnek .env dosyalarını kopyalayın:
.env dosyalarını kendi MongoDB Atlas bilgilerinizle düzenleyin
Docker Compose ile servisleri başlatın:
Servisler şu portlarda çalışacaktır:
User Service: http://localhost:3001
Product Service: http://localhost:3002
Payment Service: http://localhost:3003
API Endpoints
User Service
POST /api/users/register - Yeni kullanıcı kaydı
POST /api/users/login - Kullanıcı girişi
GET /api/users/profile - Kullanıcı profili
Product Service
GET /api/products - Tüm ürünleri listele
GET /api/products/:id - Ürün detaylarını getir
POST /api/products - Yeni ürün ekle
Payment Service
POST /api/payments - Yeni ödeme oluştur
GET /api/payments/:id - Ödeme durumunu sorgula
PUT /api/payments/:id/cancel - Ödemeyi iptal et
Geliştirme
Her servis bağımsız olarak geliştirilebilir ve test edilebilir. Servisleri ayrı ayrı çalıştırmak için:
Lisans
MIT