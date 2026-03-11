import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Mail, Lock, RefreshCcw, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Check if email exists by trying a request or using a specific check endpoint
            // For now, we proceed to password set if valid format
            setStep(2);
        } catch (err) {
            setError("Email verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Passwords do not match");
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, password });
            alert("Password reset successful!");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="animated-bg"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-8"
            >
                <Link to="/login" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
                    <p className="text-slate-400 font-medium">
                        {step === 1 ? "Enter your registered email" : "Create your new password"}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleVerifyEmail} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="john@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="glass-button w-full flex items-center justify-center gap-2">
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="glass-button w-full flex items-center justify-center gap-2">
                            <RefreshCcw size={18} />
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
