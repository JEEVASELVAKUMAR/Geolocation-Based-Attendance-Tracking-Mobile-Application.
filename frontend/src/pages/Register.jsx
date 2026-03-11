import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Hash, Briefcase, School } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        staffId: '',
        department: '',
        collegeName: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }
        
        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            await api.post('/auth/register', formData);
            alert("Registration Successful! Redirecting to login...");
            setTimeout(() => navigate('/login'), 500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="animated-bg"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-2xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2 shadow-sm italic tracking-tight">Staff Registration</h1>
                    <p className="text-slate-400 font-medium">Join the Smart Attendance Network</p>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <InputField label="First Name" name="firstName" icon={<User size={18} />} placeholder="John" value={formData.firstName} onChange={handleChange} />
                    <InputField label="Last Name" name="lastName" icon={<User size={18} />} placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                    
                    <InputField label="Email Address" name="email" type="email" icon={<Mail size={18} />} placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                    <InputField label="Staff ID" name="staffId" icon={<Hash size={18} />} placeholder="EMP123" value={formData.staffId} onChange={handleChange} />
                    
                    <InputField label="Department" name="department" icon={<Briefcase size={18} />} placeholder="Computer Science" value={formData.department} onChange={handleChange} />
                    <InputField label="College / Organization" name="collegeName" icon={<School size={18} />} placeholder="VSB Engineering College" value={formData.collegeName} onChange={handleChange} />

                    <InputField label="Password" name="password" type="password" icon={<Lock size={18} />} placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    <InputField label="Confirm Password" name="confirmPassword" type="password" icon={<Lock size={18} />} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />

                    {error && <p className="text-red-400 text-sm font-medium md:col-span-2">{error}</p>}

                    <button 
                        type="submit"
                        className="glass-button w-full md:col-span-2 flex items-center justify-center gap-2 group mt-4 h-14"
                    >
                        <UserPlus size={22} className="group-hover:translate-x-1 transition-transform" />
                        Complete Registration
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
                </div>
            </motion.div>
        </div>
    );
};

const InputField = ({ label, name, type = "text", icon, placeholder, value, onChange, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        <div className="relative group">
            <span className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-primary transition-colors">{icon}</span>
            <input 
                name={name}
                type={type} 
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none 
                         focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-slate-100"
                value={value}
                onChange={onChange}
                required
            />
        </div>
    </div>
);

export default Register;
