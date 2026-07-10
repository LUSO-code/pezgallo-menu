import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '2rem 20px',
      textAlign: 'center',
      marginTop: '2rem',
      color: 'var(--text-tertiary)',
      fontSize: '0.9rem'
    }}>
      <div style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
        Pezgallo
      </div>
      <p>&copy; {new Date().getFullYear()} Pezgallo. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
