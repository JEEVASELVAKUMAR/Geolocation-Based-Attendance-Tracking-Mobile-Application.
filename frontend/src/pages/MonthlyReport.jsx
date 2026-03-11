import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Calendar, User, Hash, Briefcase, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

const MonthlyReport = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/attendance/my-logs');
                setLogs(data);
            } catch (err) {
                console.error("Failed to fetch logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold flex items-center gap-3 italic tracking-tight">
                        <FileText className="text-primary" /> Attendance Report
                    </h1>
                    <div className="text-slate-400 font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        {format(new Date(), 'MMMM yyyy')}
                    </div>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Check-In</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Check-Out</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-400 animate-pulse">Loading reports...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">No records found for this period.</td></tr>
                                ) : logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-200">{log.employeeName || 'Self'}</div>
                                            <div className="text-xs text-slate-500">{log.staffId} • {log.department}</div>
                                        </td>
                                        <td className="p-4 text-slate-300 font-medium">{log.date}</td>
                                        <td className="p-4">
                                            {log.checkIn?.time ? (
                                                <div className="flex items-center gap-2 text-slate-200">
                                                    <Clock size={14} className="text-green-400" />
                                                    {format(new Date(log.checkIn.time), 'hh:mm a')}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4">
                                            {log.checkOut?.time ? (
                                                <div className="flex items-center gap-2 text-slate-200">
                                                    <Clock size={14} className="text-orange-400" />
                                                    {format(new Date(log.checkOut.time), 'hh:mm a')}
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 italic text-xs">Not Checked Out</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                                ${log.checkIn?.status === 'PRESENT' ? 'bg-green-500/10 text-green-400' : 
                                                  log.checkIn?.status === 'ABSENT' ? 'bg-red-500/10 text-red-400' : 
                                                  'bg-yellow-500/10 text-yellow-400'}`}>
                                                {log.checkIn?.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MonthlyReport;
