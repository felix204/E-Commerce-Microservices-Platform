const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('/app/common/utils/responsHandler');

/**
 * Kullanıcı işlemlerini yöneten controller sınıfı
 */
class UserController {

    /**
     * Yeni kullanıcı kayıt
     * @route POST /api/users/register
     */



    // Kullanıcı Kayıt
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Kullanıcı zaten var mı kontrolü
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return ResponseHandler.error(res, 'Kullanıcı zaten mevcut', 400);
            }

            // Yeni kullanıcı oluşturma
            const user = new User({ username, email, password });
            await user.save();

            // Token oluşturma
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            ResponseHandler.success(res, {
                token, user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }, 'Kayıt başarılı', 201);
        } catch (error) {
            ResponseHandler.error(res, 'Kayıt sırasında hata oluştu', 500);
        }
    }



    // Kullanıcı Girişi
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Kullanıcıyı bulma
            const user = await User.findOne({ username });
            if (!user) {
                return ResponseHandler.error(res, 'Kullanıcı bulunamadı', 404);
            }

            // Şifre kontrolü
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return ResponseHandler.error(res, 'Geçersiz şifre', 401);
            }

            // Token oluşturma
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            ResponseHandler.success(res, {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }, 'Giriş başarılı');
        } catch (error) {
            ResponseHandler.error(res, 'Giriş sırasında hata oluştu', 500);
        }
    }



    // Profil Güncelleme
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { profile: updateData } },
                { new: true }
            );

            ResponseHandler.success(res, {
                user: {
                    id: user._id,
                    username: user.username,
                    profile: user.profile
                }
            }, 'Profil güncellendi');
        } catch (error) {
            ResponseHandler.error(res, 'Profil güncellenemedi', 500);
        }
    }




    // Profil Bilgilerini Getirme
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select('-password');

            ResponseHandler.success(res, {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profile: user.profile
                }
            });
        } catch (error) {
            ResponseHandler.error(res, 'Profil bilgileri getirilemedi', 500);
        }
    }
}

module.exports = UserController;