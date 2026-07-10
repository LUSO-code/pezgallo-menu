import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1599907694363-d142d109f07a?auto=format&fit=crop&q=80&w=600",
  ];

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
          marginBottom: '3rem'
        }}
      >
        Galería
      </motion.h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="luso-glass"
            style={{
              overflow: 'hidden',
              aspectRatio: '1',
              borderRadius: 'var(--glass-radius-sm)'
            }}
          >
            <motion.img 
              src={src} 
              alt={`Galería Pezgallo ${index + 1}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
