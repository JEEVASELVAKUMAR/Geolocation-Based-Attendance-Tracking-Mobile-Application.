import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, LogOut, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [lateReason, setLateReason] = useState('');
    const [earlyLeaveReason, setEarlyLeaveReason] = useState('');
    const [showLateInput, setShowLateInput] = useState(false);
    const [showEarlyInput, setShowEarlyInput] = useState(false);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setLocation(pos.coords),
            (err) => setError("Location permission required"),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Sync location every minute
    useEffect(() => {
        if (!location) return;
        const interval = setInterval(async () => {
            try {
                const { data } = await api.post('/attendance/sync-location', {
                    latitude: location.latitude,
                    longitude: location.longitude
                });
                if (!data.withinGeofence) {
                    setError("You have exited the organization location.");
                } else {
                    setError(null);
                    // Proactive suggest if not checked in
                    if (!message && !error) {
                        setMessage("Location detected: You are within the organization. Please mark your attendance.");
                    }
                }
            } catch (err) {
                console.error("Location sync failed", err);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [location]);

    const handleCheckIn = async (e) => {
        e?.preventDefault();
        if (!location) return setError("Acquiring GPS coordinates...");
        
        const now = new Date();
        const deadline = new Date();
        deadline.setHours(9, 15, 0, 0);

        if (now > deadline && !lateReason) {
            setShowLateInput(true);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/attendance/check-in', {
                latitude: location.latitude,
                longitude: location.longitude,
                lateReason
            });
            setMessage(`Attendance recorded: Check-In at ${format(now, 'hh:mm a')}. Thank you!`);
            setShowLateInput(false);
            
            // Show notification
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Attendance Recorded", {
                    body: `Check-In Time: ${format(now, 'hh:mm a')}\nThank you for coming!`
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Check-in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (e) => {
        e?.preventDefault();
        const now = new Date();
        const normalTime = new Date();
        normalTime.setHours(16, 40, 0, 0);

        if (now < normalTime && !earlyLeaveReason) {
            setShowEarlyInput(true);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/attendance/check-out', {
                latitude: location.latitude,
                longitude: location.longitude,
                earlyLeaveReason
            });
            setMessage(`Successfully checked out at ${format(now, 'hh:mm a')}. Thank you!`);
            setShowEarlyInput(false);

            // Show notification
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Check-Out Successful", {
                    body: `Time: ${format(now, 'hh:mm a')}\nThank you for visiting!`
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Check-out failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="animated-bg"></div>
            
            <Header user={user} logout={logout} />

            <main className="max-w-4xl mx-auto mt-12 space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 grid md:grid-cols-2 gap-8"
                >
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Employee Info</h2>
                            <h3 className="text-2xl font-black italic tracking-tighter">{user.firstName} {user.lastName}</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{user.staffId} • {user.department}</p>
                            <p className="text-slate-500 text-xs mt-1 font-medium">{user.email}</p>
                            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-black text-[10px] uppercase tracking-tighter mt-3">
                                {user.collegeName || user.organization?.name}
                            </div>
                        </section>

                        <section className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-3 text-slate-300 mb-2">
                                <MapPin size={18} className="text-blue-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Live GPS Location</span>
                            </div>
                            {location ? (
                                <p className="text-xs font-mono text-slate-400">
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </p>
                            ) : (
                                <div className="flex items-center gap-2 text-yellow-500 text-xs font-semibold">
                                    <Loader2 size={12} className="animate-spin" />
                                    Acquiring Location...
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        {!showLateInput && !showEarlyInput && (
                            <>
                                <button 
                                    onClick={handleCheckIn}
                                    disabled={loading || !location}
                                    className="glass-button w-full flex items-center justify-center gap-3 py-4 text-lg"
                                >
                                    <Clock size={24} />
                                    {loading ? "Checking in..." : "Mark Attendance"}
                                </button>
                                <button 
                                    onClick={handleCheckOut}
                                    disabled={loading || !location}
                                    className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
                                >
                                    <LogOut size={24} />
                                    Departure (Check-out)
                                </button>
                            </>
                        )}

                        <AnimatePresence>
                            {showLateInput && (
                                <motion.form 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleCheckIn}
                                    className="space-y-3"
                                >
                                    <label className="text-sm font-semibold text-red-400">Late Entry Reason Required</label>
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-red-500/50 transition-all text-sm h-24"
                                        placeholder="Enter reason (e.g., Traffic delay, Medical...)"
                                        value={lateReason}
                                        onChange={(e) => setLateReason(e.target.value)}
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="glass-button flex-1 py-2 text-sm">Submit</button>
                                        <button type="button" onClick={() => setShowLateInput(false)} className="px-4 py-2 border border-white/10 rounded-xl text-sm">Cancel</button>
                                    </div>
                                </motion.form>
                            )}

                            {showEarlyInput && (
                                <motion.form 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleCheckOut}
                                    className="space-y-3"
                                >
                                    <label className="text-sm font-semibold text-yellow-400">Early Leave Reason Required</label>
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500/50 transition-all text-sm h-24"
                                        placeholder="Enter reason (e.g., Medical, Personal emergency...)"
                                        value={earlyLeaveReason}
                                        onChange={(e) => setEarlyLeaveReason(e.target.value)}
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="glass-button flex-1 py-2 text-sm bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Submit</button>
                                        <button type="button" onClick={() => setShowEarlyInput(false)} className="px-4 py-2 border border-white/10 rounded-xl text-sm">Cancel</button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Notifications */}
                {(message || error) && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border flex gap-3 ${message ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                    >
                        {message ? <CheckCircle /> : <AlertCircle />}
                        <div>
                            <p className="font-bold">{message || "System Alert"}</p>
                            <p className="text-sm opacity-80">{message ? "Your attendance has been linked to your profile." : error}</p>
                        </div>
                    </motion.div>
                )}
            </main>

            <footer className="fixed bottom-6 w-full text-center text-xs text-slate-500 font-medium">
                <p>Created with ❤️ by JEEVA S</p>
                <p className="mt-1">Developed using GIS Technology – VSB Engineering College</p>
            </footer>
        </div>
    );
};

const Header = ({ user, logout }) => (
    <nav className="flex items-center justify-between max-w-6xl mx-auto glass-card px-6 py-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20">
                {user.firstName[0]}
            </div>
            <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Secure Portal</p>
                <p className="font-black italic tracking-tighter leading-none">SMART ATTENDANCE</p>
            </div>
        </div>
        <button onClick={logout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-red-400">
            <LogOut size={20} />
        </button>
    </nav>
);

export default Dashboard;
