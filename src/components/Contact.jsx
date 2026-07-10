import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="ubicacion" className="container" style={{ padding: '5rem 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}
      >
        Visítanos
      </motion.h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        
        {/* Contact Info Card */}
        <motion.div 
          className="luso-glass"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ flex: '1 1 300px', padding: '2rem' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Teléfono</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>312-131-89-31</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Horario</h3>
            <p style={{ fontSize: '1.1rem' }}>Miércoles a Domingo</p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)' }}>12:00 PM – 6:00 PM</p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Redes</h3>
            <a 
              href="https://instagram.com/_pezgallo" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              @_pezgallo
            </a>
          </div>
        </motion.div>

        {/* Map Placeholder Card */}
        <motion.div 
          className="luso-glass"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ 
            flex: '2 1 400px', 
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* A simple placeholder for Google Maps */}
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Ubicación en Google Maps</p>
            <p style={{ fontSize: '0.9rem' }}>(Integración de mapa pendiente)</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
