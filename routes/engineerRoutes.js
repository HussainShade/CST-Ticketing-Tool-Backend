const express = require('express');
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/engineerController');
const router = express.Router();

router.post('/', auth, controller.addEngineer);
router.put('/:id', auth, controller.editEngineer);
router.delete('/:id', auth, controller.deleteEngineer);
router.get('/', auth, controller.getAllEngineers);

module.exports = router;