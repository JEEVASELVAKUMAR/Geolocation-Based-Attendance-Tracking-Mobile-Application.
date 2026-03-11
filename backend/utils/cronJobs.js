const cron = require('node-cron');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { format } = require('date-fns');

// Run at 09:16 AM every day
cron.schedule('16 9 * * *', async () => {
    console.log('Running Auto-Absence Cron Job...');
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
        const employees = await User.find({ role: 'employee' });

        for (const employee of employees) {
            const attendance = await Attendance.findOne({ user: employee._id, date: today });

            if (!attendance) {
                await Attendance.create({
                    user: employee._id,
                    organization: employee.organization,
                    date: today,
                    checkIn: {
                        status: 'ABSENT'
                    },
                    isAutoMarked: true
                });
                console.log(`Auto-marked ABSENT for: ${employee.name}`);
            }
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

// Run at 11:59 PM every day for Auto-Checkout
cron.schedule('59 23 * * *', async () => {
    console.log('Running Auto-Checkout Cron Job...');
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
        const activeAttendance = await Attendance.find({ 
            date: today, 
            'checkIn.time': { $exists: true },
            'checkOut.time': { $exists: false }
        });

        for (const log of activeAttendance) {
            log.checkOut = {
                time: new Date(),
                location: log.checkIn.location,
                earlyLeaveReason: 'Auto-Checkout by System'
            };
            await log.save();
            console.log(`Auto-checked out for user: ${log.user}`);
        }
    } catch (error) {
        console.error('Auto-checkout cron error:', error);
    }
});
