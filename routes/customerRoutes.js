const express = require('express');
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/customerController');
const router = express.Router();

router.post('/', auth, controller.addCustomer);
router.put('/:id', auth, controller.editCustomer);
router.delete('/:id', auth, controller.deleteCustomer);
router.get('/', auth, controller.getAllCustomers);

module.exports = router;