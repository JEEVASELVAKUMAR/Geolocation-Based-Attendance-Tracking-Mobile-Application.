const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },
    employeeName: String,
    email: String,
    staffId: String,
    department: String,
    collegeName: String,
    date: {
        type: String, // Format: YYYY-MM-DD for easy querying
        required: true
    },
    checkIn: {
        time: Date,
        location: {
            latitude: Number,
            longitude: Number
        },
        status: {
            type: String,
            enum: ['PRESENT', 'LATE PRESENT', 'ABSENT'],
            default: 'ABSENT'
        },
        lateReason: String
    },
    checkOut: {
        time: Date,
        location: {
            latitude: Number,
            longitude: Number
        },
        earlyLeaveReason: String
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['PRESENT', 'LATE PRESENT', 'ABSENT', 'LEFT LOCATION'],
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        location: {
            latitude: Number,
            longitude: Number
        }
    }],
    isAutoMarked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure unique attendance record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
