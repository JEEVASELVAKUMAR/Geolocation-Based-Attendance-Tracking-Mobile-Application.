import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="animated-bg"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Login</h1>
                    <p className="text-slate-400 font-medium">Smart Geolocation System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary/50 transition-all font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" size={20} className="text-xs text-blue-400 hover:text-blue-300 font-bold">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                    <button 
                        type="submit"
                        className="glass-button w-full flex items-center justify-center gap-2 group"
                    >
                        <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link>
                </div>

                <div className="mt-8 text-center text-slate-500 text-sm">
                    <p>Created with ❤️ by JEEVA S</p>
                    <p className="mt-1">Developed using GIS Technology – VSB Engineering College</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
