import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// 🔧 CONFIGURACIÓN: Pega aquí tu Widget ID de Elfsight
// 
// Pasos para obtenerlo:
// 1. Ve a https://elfsight.com y crea una cuenta gratuita
// 2. Crea un widget "Instagram Feed"
// 3. Conecta la cuenta @_pezgallo
// 4. Personaliza el diseño (recomendado: Grid, 3 columnas, fondo transparente)
// 5. Haz clic en "Add to Website" y copia el Widget ID
//    (es el código alfanumérico largo, ej: "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
// 6. Pégalo aquí abajo reemplazando la cadena vacía:
// ============================================================
const ELFSIGHT_WIDGET_ID = '';

const Gallery = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!ELFSIGHT_WIDGET_ID) return;

    // Load the Elfsight platform script if not already loaded
    if (!document.querySelector('script[src*="elfsight.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="container" style={{ padding: '5rem 20px' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}
      >
        Galería
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          fontWeight: 300
        }}
      >
        Síguenos en{' '}
        <a 
          href="https://www.instagram.com/_pezgallo/" 
          target="_blank" 
          rel="noreferrer"
          style={{ 
            color: 'var(--accent-blue)', 
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'opacity 0.3s'
          }}
        >
          @_pezgallo
        </a>
      </motion.p>

      {ELFSIGHT_WIDGET_ID ? (
        /* ── Live Instagram Feed via Elfsight ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          ref={widgetRef}
        >
          <div 
            className={`elfsight-app-${ELFSIGHT_WIDGET_ID}`}
            data-elfsight-app-lazy
          />
        </motion.div>
      ) : (
        /* ── Placeholder: Instagram Profile Link ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="luso-glass"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1.5rem',
            lineHeight: 1
          }}>
            📸
          </div>
          <h3 style={{ 
            fontSize: '1.4rem', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-serif)'
          }}>
            Descubre nuestros platillos
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '2rem',
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}>
            Visita nuestro Instagram para ver fotos de nuestros platillos frescos, 
            el ambiente del restaurante y las novedades del día.
          </p>
          <motion.a
            href="https://www.instagram.com/_pezgallo/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--glass-radius)',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(225, 48, 108, 0.3)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Ver en Instagram
          </motion.a>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
