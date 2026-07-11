import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData } from '../data/menuData';

const Menu = ({ menuData = staticMenuData }) => {
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.category || '');

  const currentCategoryData = menuData.find(cat => cat.category === activeCategory) || menuData[0];

  return (
    <section id="menu" className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
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
        Nuestro Menú
      </motion.h2>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '1.2rem 0.5rem',
        marginBottom: '2rem',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
      className="menu-tabs-container"
      >
        {menuData.map((category) => (
          <button
            key={category.category}
            onClick={() => setActiveCategory(category.category)}
            className="luso-glass"
            style={{
              padding: '10px 24px',
              cursor: 'pointer',
              color: activeCategory === category.category ? '#fff' : 'var(--text-secondary)',
              background: activeCategory === category.category ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
              borderColor: activeCategory === category.category ? 'var(--glass-border-light)' : 'var(--glass-border)',
              fontWeight: activeCategory === category.category ? 600 : 400,
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-primary)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {category.category}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
          >
            {/* Featured Image */}
            <div 
              className="luso-glass"
              style={{
                width: '100%',
                height: '250px',
                borderRadius: 'var(--glass-radius)',
                overflow: 'hidden',
                marginBottom: '2rem',
                position: 'relative'
              }}
            >
              <img 
                src={currentCategoryData.image} 
                alt={currentCategoryData.category}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: currentCategoryData.imagePosition || 'center',
                  opacity: 0.8
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(to top, rgba(10, 14, 26, 0.9), transparent)',
                padding: '2rem 1.5rem 1rem 1.5rem',
              }}>
                <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
                  {currentCategoryData.category}
                </h3>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {currentCategoryData.items.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="luso-glass"
                  style={{ padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 500, flex: '1 1 auto' }}>
                      {item.name}
                      {item.tag && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: 'rgba(255,255,255,0.1)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          marginLeft: '10px',
                          verticalAlign: 'middle',
                          color: 'var(--text-secondary)'
                        }}>
                          {item.tag}
                        </span>
                      )}
                    </h4>
                    <span style={{ 
                      color: 'var(--accent-blue)', 
                      fontWeight: 600, 
                      fontSize: '1rem',
                      textAlign: 'right'
                    }}>
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
                      {item.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .menu-tabs-container {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
          mask-image: linear-gradient(to right, transparent 0%, #000 24px, #000 calc(100% - 24px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 24px, #000 calc(100% - 24px), transparent 100%);
        }
        .menu-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Menu;
