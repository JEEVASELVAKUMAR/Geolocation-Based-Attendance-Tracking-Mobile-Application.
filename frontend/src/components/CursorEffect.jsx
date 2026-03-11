import React, { useEffect } from 'react';

const CursorEffect = () => {
    useEffect(() => {
        const handleClick = (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${e.clientX - 10}px`;
            ripple.style.top = `${e.clientY - 10}px`;
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Particle burst
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const colors = ['#6366f1', '#a855f7', '#ec4899'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = '6px';
                particle.style.height = '6px';
                particle.style.left = `${e.clientX}px`;
                particle.style.top = `${e.clientY}px`;
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 50;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                document.body.appendChild(particle);

                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 800,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                }).onfinish = () => particle.remove();
            }
        };

        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return null;
};

export default CursorEffect;
