import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // The intro sequence lasts for exactly 5 seconds before unmounting
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 1.2, delay: 3.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999, background: '#050810',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Cinematic 3D lighting background effects */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, var(--brand-red) 0%, transparent 70%)',
          filter: 'blur(80px)', mixBlendMode: 'screen', pointerEvents: 'none'
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1.5 }}
        transition={{ duration: 4, delay: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: '20%', right: '30%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, var(--info-blue) 0%, transparent 70%)',
          filter: 'blur(80px)', mixBlendMode: 'screen', pointerEvents: 'none'
        }}
      />

      <motion.img 
        src="https://upload.wikimedia.org/wikipedia/en/5/53/2026_FIFA_World_Cup_logo.svg" 
        initial={{ scale: 0.8, opacity: 0, y: 50, filter: 'blur(10px)' }}
        animate={{ scale: 1.1, opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 140, marginBottom: 50, zIndex: 2 }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20, letterSpacing: '0.0em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
        transition={{ delay: 1.2, duration: 2, ease: 'easeOut' }}
        style={{ 
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 8vw, 84px)', 
          color: 'white', zIndex: 2, textAlign: 'center', lineHeight: 1,
          textShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}
      >
        <span style={{ color: 'var(--brand-gold)' }}>FIFA</span> WORLD CUP
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 18, 
          color: 'var(--text-muted)', marginTop: 16, zIndex: 2,
          textTransform: 'uppercase', letterSpacing: '0.3em'
        }}
      >
        Canada · Mexico · USA
      </motion.div>

      {/* Sweeping scanline effect */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 4, 
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)',
          boxShadow: '0 0 20px rgba(255,215,0,0.8)', zIndex: 3, pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
}
