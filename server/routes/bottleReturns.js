const express = require('express');
const router = express.Router();
const { recordReturn, getInventoryReport } = require('../controllers/bottleReturnController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, recordReturn);
router.get('/inventory', auth, authorize('admin'), getInventoryReport);

module.exports = router;
