const express = require('express');
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/ticketController');
const router = express.Router();

router.post('/', auth, controller.createTicket);
router.put('/:ticketId', auth, controller.editTicket);
router.get('/', auth, controller.getAllTickets);

module.exports = router;