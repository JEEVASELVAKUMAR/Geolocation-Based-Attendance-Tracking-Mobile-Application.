const express = require('express');
const router = express.Router();
const { checkIn, checkOut, syncLocation, getAttendanceLogs, exportAttendanceExcel } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.post('/sync-location', protect, syncLocation);
router.get('/my-logs', protect, getAttendanceLogs);
router.get('/export-excel', protect, admin, exportAttendanceExcel);

module.exports = router;
