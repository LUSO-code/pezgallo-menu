import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img 
          src="/logo.png" 
          alt="Pezgallo Logo" 
          style={{ width: '150px', marginBottom: '1.5rem' }} 
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
        <h1 style={{ 

          fontFamily: 'var(--font-serif)', 
          fontSize: '4rem', 
          marginBottom: '0.5rem',
          letterSpacing: '2px',
          fontWeight: 600
        }}>
          Pezgallo
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          letterSpacing: '1px',
          marginBottom: '2.5rem',
          fontWeight: 300
        }}>
          Cocina tradicional de mar
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.a 
            href="#menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="luso-glass"
            style={{
              padding: '12px 32px',
              textDecoration: 'none',
              color: 'white',
              fontWeight: 500,
              fontSize: '1.1rem',
              display: 'inline-block'
            }}
          >
            Ver Menú
          </motion.a>
          
          <motion.a 
            href="#ubicacion"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="luso-glass"
            style={{
              padding: '12px 32px',
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '1.1rem',
              display: 'inline-block'
            }}
          >
            Ubicación
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
