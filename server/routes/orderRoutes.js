const express = require('express');
const { createOrder, updateOrderStatus, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

router.get('/orders', getAllOrders);             
router.post('/orders', createOrder);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
