import React, { useState, useRef, useEffect } from 'react';

const ImageCropper = ({ onCrop, onCancel, imageUrl }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        setImgElement(img);
        // Reset crop settings on new image
        setScale(1);
        setOffset({ x: 0, y: 0 });
      };
    }
  }, [imageUrl]);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleSave = () => {
    if (!imgElement || !containerRef.current || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set crop size (standard 16:9 ratio for card aspect, e.g., 800x450 for clean crisp display)
    const targetWidth = 800;
    const targetHeight = 450;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Get visible dims from the crop container
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Natural dimensions of loaded image
    const natWidth = imgElement.naturalWidth;
    const natHeight = imgElement.naturalHeight;

    // Calculate how the image currently fills the container before zoom/drag
    // Similar to object-fit: cover logic
    const containerRatio = containerWidth / containerHeight;
    const imgRatio = natWidth / natHeight;

    let renderWidth, renderHeight;
    if (imgRatio > containerRatio) {
      renderHeight = containerHeight;
      renderWidth = containerHeight * imgRatio;
    } else {
      renderWidth = containerWidth;
      renderHeight = containerWidth / imgRatio;
    }

    // Now calculate position relative to the container center
    const xBase = (containerWidth - renderWidth) / 2;
    const yBase = (containerHeight - renderHeight) / 2;

    // Apply scaling and offsets
    const finalWidth = renderWidth * scale;
    const finalHeight = renderHeight * scale;
    const xFinal = xBase * scale + offset.x;
    const yFinal = yBase * scale + offset.y;

    // Map container coords back to the 800x450 canvas
    const scaleFactorX = targetWidth / containerWidth;
    const scaleFactorY = targetHeight / containerHeight;

    // Draw the cropped portion to the canvas
    ctx.drawImage(
      imgElement,
      // Source rectangle on natural image
      0, 0, natWidth, natHeight,
      // Target rectangle on canvas
      xFinal * scaleFactorX,
      yFinal * scaleFactorY,
      finalWidth * scaleFactorX,
      finalHeight * scaleFactorY
    );

    // Convert to webp at 85% quality
    const dataUrl = canvas.toDataURL('image/webp', 0.85);
    onCrop(dataUrl);
  };

  const [aspectMode, setAspectMode] = useState('mobile'); // 'mobile' (16/10) | 'desktop' (3.8/1)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(3, 8, 18, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <h3 style={{ marginBottom: '5px', color: 'white', fontFamily: 'var(--font-primary)' }}>Ajustar Encuadre de la Imagen</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
        Arrastra para centrar y cambia de vista previa para asegurar que se vea bien en celulares y computadoras.
      </p>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
        <button
          onClick={() => setAspectMode('mobile')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: aspectMode === 'mobile' ? 'var(--accent-blue)' : 'transparent',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          📱 Vista Móvil (Celular)
        </button>
        <button
          onClick={() => setAspectMode('desktop')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: aspectMode === 'desktop' ? '#ffb703' : 'transparent',
            color: aspectMode === 'desktop' ? '#000' : 'white',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          💻 Vista Escritorio (PC)
        </button>
      </div>

      {/* Crop Window Container */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '500px',
          aspectRatio: aspectMode === 'mobile' ? '16/10' : '3.8/1',
          transition: 'aspect-ratio 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '16px',
          border: aspectMode === 'mobile' ? '2px solid var(--accent-blue)' : '2px solid #ffb703',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {imageUrl ? (
          <img
            ref={imageRef}
            src={imageUrl}
            alt="To crop"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
            Cargando imagen...
          </div>
        )}
        
        {/* Overlay grid to help framing */}
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed rgba(255,255,255,0.3)',
          pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
        }}>
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
          <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
          <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.15)' }}></div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ width: '100%', maxWidth: '500px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <span style={{ color: 'white', fontSize: '0.9rem' }}>🔍 Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{
              flex: 1,
              accentColor: 'var(--accent-blue)',
              height: '6px',
              borderRadius: '3px',
              outline: 'none',
            }}
          />
          <span style={{ color: 'white', fontSize: '0.9rem', minWidth: '40px', textAlign: 'right' }}>
            {Math.round(scale * 100)}%
          </span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: '12px',
              background: 'linear-gradient(135deg, #0077b6, #0096c7)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0, 119, 182, 0.4)',
            }}
          >
            Confirmar Encuadre
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
