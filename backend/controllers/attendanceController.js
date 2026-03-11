const Attendance = require('../models/Attendance');
const Organization = require('../models/Organization');
const geolib = require('geolib');
const { format } = require('date-fns');
const xlsx = require('xlsx');
const User = require('../models/User');

// Helper to check if location is within geofence
const isWithinGeofence = (empLat, empLon, orgLat, orgLon, radius) => {
    const distance = geolib.getDistance(
        { latitude: empLat, longitude: empLon },
        { latitude: orgLat, longitude: orgLon }
    );
    return distance <= radius;
};

exports.checkIn = async (req, res) => {
    const { latitude, longitude, lateReason } = req.body;
    const userId = req.user._id;
    const orgId = req.user.organization;
    const today = format(new Date(), 'yyyy-MM-dd');

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    // 1. Geolocation Validation
    if (!isWithinGeofence(latitude, longitude, org.location.latitude, org.location.longitude, org.geofenceRadius)) {
        return res.status(403).json({ message: 'You are outside the organization location. Attendance cannot be marked.' });
    }

    // 2. Timing Logic
    const now = new Date();
    const checkInStart = new Date();
    checkInStart.setHours(9, 0, 0, 0);
    const checkInDeadline = new Date();
    checkInDeadline.setHours(9, 15, 0, 0);

    let status = 'PRESENT';
    if (now > checkInDeadline) {
        if (!lateReason) {
            return res.status(400).json({ message: 'Mandatory Late Entry Reason required after 09:15 AM' });
        }
        status = 'LATE PRESENT';
    }

    try {
        const attendance = await Attendance.findOneAndUpdate(
            { user: userId, date: today },
            {
                user: userId,
                organization: orgId,
                date: today,
                employeeName: `${req.user.firstName} ${req.user.lastName}`,
                email: req.user.email,
                staffId: req.user.staffId,
                department: req.user.department,
                collegeName: req.user.collegeName,
                checkIn: {
                    time: now,
                    location: { latitude, longitude },
                    status,
                    lateReason
                },
                $push: { statusHistory: { status, location: { latitude, longitude } } }
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'Your attendance has been successfully recorded. Thank you for being present at the organization.',
            attendance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkOut = async (req, res) => {
    const { latitude, longitude, earlyLeaveReason } = req.body;
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const now = new Date();
    const normalCheckOutTime = new Date();
    normalCheckOutTime.setHours(16, 40, 0, 0);

    if (now < normalCheckOutTime && !earlyLeaveReason) {
        return res.status(400).json({ message: 'Mandatory Early Leave Reason required before 04:40 PM' });
    }

    try {
        const attendance = await Attendance.findOneAndUpdate(
            { user: userId, date: today },
            {
                checkOut: {
                    time: now,
                    location: { latitude, longitude },
                    earlyLeaveReason
                }
            },
            { new: true }
        );

        res.status(200).json({ message: 'Check-out successful', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.syncLocation = async (req, res) => {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;
    const orgId = req.user.organization;
    const today = format(new Date(), 'yyyy-MM-dd');

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const within = isWithinGeofence(latitude, longitude, org.location.latitude, org.location.longitude, org.geofenceRadius);

    if (!within) {
        await Attendance.findOneAndUpdate(
            { user: userId, date: today },
            { $push: { statusHistory: { status: 'LEFT LOCATION', location: { latitude, longitude } } } }
        );
        return res.json({ withinGeofence: false, message: 'You have exited the organization location.' });
    }

    res.json({ withinGeofence: true });
};

exports.getAttendanceLogs = async (req, res) => {
    let query = {};
    if (req.user.role !== 'admin') {
        query.user = req.user._id;
    }
    const logs = await Attendance.find(query).sort({ createdAt: -1 });
    res.json(logs);
};

exports.exportAttendanceExcel = async (req, res) => {
    try {
        const logs = await Attendance.find({}).sort({ date: -1 });
        
        const data = logs.map(log => ({
            'Employee Name': log.employeeName,
            'Email': log.email,
            'Staff ID': log.staffId,
            'Department': log.department,
            'College Name': log.collegeName,
            'Date': log.date,
            'Check-In Time': log.checkIn?.time ? format(new Date(log.checkIn.time), 'hh:mm a') : 'N/A',
            'Check-Out Time': log.checkOut?.time ? format(new Date(log.checkOut.time), 'hh:mm a') : 'N/A'
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Attendance');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
