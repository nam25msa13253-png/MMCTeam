const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Import toàn bộ 12 Controller
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const hostController = require('../controllers/hostController');
const orderController = require('../controllers/orderController');
const packageController = require('../controllers/packageController');
const paymentController = require('../controllers/paymentController');
const reviewController = require('../controllers/reviewController');
const disputeController = require('../controllers/disputeController');
const walletController = require('../controllers/walletController');
const notificationController = require('../controllers/notificationController');
const statsController = require('../controllers/statsController');
const aiController = require('../controllers/aiController');

// Middleware xác thực
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ success: false, message: 'Thiếu Token' });
    try {
        const cleanToken = token.replace('Bearer ', '');
        req.user = jwt.verify(cleanToken, process.env.JWT_SECRET || 'hht_academy_secret_key_2025');
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token hết hạn' });
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.vai_tro)) {
        return res.status(403).json({ success: false, message: 'Không có quyền' });
    }
    next();
};

// --- ROUTES ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/send-otp', authController.sendOTP);
router.get('/auth/me', verifyToken, authController.getMe);

router.get('/users', verifyToken, authorize(['quan_tri']), userController.getAllUsers);
router.put('/users/profile', verifyToken, userController.updateProfile);

router.get('/hosts/search', hostController.searchHosts);
router.put('/hosts/status', verifyToken, authorize(['chu_nha']), hostController.updateStatus);

router.get('/packages', packageController.getAllPackages);
router.post('/packages/subscribe', verifyToken, packageController.subscribePackage);

router.post('/orders', verifyToken, orderController.createOrder);
router.get('/orders/mine', verifyToken, orderController.getMyOrders);
router.put('/orders/:id/status', verifyToken, orderController.updateOrderStatus);

router.post('/payments/create', verifyToken, paymentController.createPaymentIntent);
router.post('/reviews', verifyToken, reviewController.createReview);
router.post('/disputes', verifyToken, disputeController.createDispute);

router.get('/wallet/balance', verifyToken, walletController.getBalance);
router.get('/notifications', verifyToken, notificationController.getMyNotifications);
router.put('/notifications/:id/read', verifyToken, notificationController.markAsRead);

router.get('/admin/stats', verifyToken, authorize(['quan_tri']), statsController.getOverview);
router.post('/ai/matching', verifyToken, aiController.findBestHost);

module.exports = router;