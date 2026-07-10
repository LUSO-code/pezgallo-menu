import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = new URL('/logo.png', import.meta.url).href;

const Hero = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
        <motion.div 
          className="luso-glass"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            overflow: 'hidden',
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid rgba(0, 119, 182, 0.3)',
            boxShadow: '0 0 40px rgba(0, 119, 182, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          {!logoError ? (
            <img 
              src={LOGO_URL}
              alt="Pezgallo Logo" 
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoError(true)}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                borderRadius: '50%',
                opacity: logoLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
              }} 
            />
          ) : (
            <span style={{ 
              fontSize: '3rem', 
              color: 'var(--accent-blue)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600
            }}>
              🐟
            </span>
          )}
        </motion.div>
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
