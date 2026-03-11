import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
        >
            <div className="animated-bg"></div>
            
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center"
            >
                <h1 className="text-6xl font-black gradient-text tracking-tighter mb-4 shadow-2xl">
                    SMART GEO
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8"></div>
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm mb-2">Presents</p>
                    <h2 className="text-2xl font-bold text-white tracking-widest">JEEVA S</h2>
                </motion.div>
            </motion.div>

            <motion.div 
                className="absolute bottom-12 text-slate-500 font-medium text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                VSB Engineering College
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
