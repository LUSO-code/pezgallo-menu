import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData as staticMenuData } from '../data/menuData';
import ImageCropper from './ImageCropper';
import { LogIn, Save, Plus, Trash2, ChevronUp, ChevronDown, Edit2, Image as ImageIcon, X } from 'lucide-react';

const Admin = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [menu, setMenu] = useState([]);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'categories'
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Editing state
  const [editingItem, setEditingItem] = useState(null); // { catIndex, itemIndex, item }
  const [isAddingItem, setIsAddingItem] = useState(null); // catIndex
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', tag: '' });

  // Cropping State
  const [cropTarget, setCropTarget] = useState(null); // { type: 'category', index: number }
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check session
    const session = sessionStorage.getItem('pezgallo_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }

    // Load data (local storage draft or static menuData)
    const localDraft = localStorage.getItem('pezgallo_menu_draft');
    if (localDraft) {
      try {
        setMenu(JSON.parse(localDraft));
      } catch (e) {
        setMenu(JSON.parse(JSON.stringify(staticMenuData)));
      }
    } else {
      setMenu(JSON.parse(JSON.stringify(staticMenuData)));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'PGdeivid') {
      setIsAuthenticated(true);
      sessionStorage.setItem('pezgallo_admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pezgallo_admin_session');
  };

  const saveLocalDraft = (updatedMenu) => {
    setMenu(updatedMenu);
    localStorage.setItem('pezgallo_menu_draft', JSON.stringify(updatedMenu));
  };

  const handleSyncCloud = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('https://kvdb.io/pezgallo_bucket_7f1a9b2c3d/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });
      if (response.ok) {
        alert('🎉 ¡Menú sincronizado con la nube con éxito! Los cambios son visibles al instante en todos los dispositivos de tus clientes.');
      } else {
        throw new Error('Error al conectar con la base de datos.');
      }
    } catch (error) {
      console.warn('Sync failed:', error);
      alert(`⚠️ Error al sincronizar con la nube: ${error.message}. Los cambios siguen guardados de manera local en este dispositivo.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Category CRUD
  const handleAddCategory = () => {
    const name = prompt('Nombre de la nueva categoría:');
    if (!name) return;
    const updated = [...menu, { category: name, image: '', items: [] }];
    saveLocalDraft(updated);
  };

  const handleDeleteCategory = (index) => {
    if (!confirm(`¿Seguro que quieres borrar la categoría "${menu[index].category}" y todos sus platillos?`)) return;
    const updated = menu.filter((_, i) => i !== index);
    saveLocalDraft(updated);
  };

  const handleMoveCategory = (index, direction) => {
    const updated = [...menu];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    saveLocalDraft(updated);
  };

  // Dish CRUD
  const handleStartAddItem = (catIndex) => {
    setIsAddingItem(catIndex);
    setNewItem({ name: '', price: '', description: '', tag: '' });
  };

  const handleConfirmAddItem = (catIndex) => {
    if (!newItem.name || !newItem.price) {
      alert('Nombre y Precio son requeridos.');
      return;
    }
    const updated = [...menu];
    updated[catIndex].items.push(newItem);
    saveLocalDraft(updated);
    setIsAddingItem(null);
  };

  const handleDeleteItem = (catIndex, itemIndex) => {
    if (!confirm('¿Eliminar este platillo?')) return;
    const updated = [...menu];
    updated[catIndex].items = updated[catIndex].items.filter((_, i) => i !== itemIndex);
    saveLocalDraft(updated);
  };

  const handleMoveItem = (catIndex, itemIndex, direction) => {
    const updated = [...menu];
    const items = [...updated[catIndex].items];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[itemIndex];
    items[itemIndex] = items[targetIndex];
    items[targetIndex] = temp;
    updated[catIndex].items = items;
    saveLocalDraft(updated);
  };

  const handleStartEditItem = (catIndex, itemIndex) => {
    setEditingItem({
      catIndex,
      itemIndex,
      item: { ...menu[catIndex].items[itemIndex] }
    });
  };

  const handleConfirmEditItem = () => {
    const { catIndex, itemIndex, item } = editingItem;
    if (!item.name || !item.price) {
      alert('Nombre y precio requeridos.');
      return;
    }
    const updated = [...menu];
    updated[catIndex].items[itemIndex] = item;
    saveLocalDraft(updated);
    setEditingItem(null);
  };

  // Image Processing
  const handleImageFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageUrl(reader.result);
      setCropTarget({ type: 'category', index });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBase64) => {
    const index = cropTarget.index;
    
    // In local mode, save base64 directly to draft
    const updated = [...menu];
    updated[index].image = croppedBase64;
    saveLocalDraft(updated);
    
    setCropTarget(null);
    setTempImageUrl(null);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <motion.div 
          className="luso-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <img src="/logo.png" alt="Pezgallo Logo" style={{ width: '80px', marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Administración</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>Introduce las credenciales de tu establecimiento</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            {loginError && <p style={{ color: '#ff4d4f', fontSize: '0.9rem' }}>{loginError}</p>}

            <button
              type="submit"
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, var(--accent-blue), #0077b6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0, 119, 182, 0.4)',
                marginTop: '10px'
              }}
            >
              <LogIn size={20} /> Entrar
            </button>

            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '10px',
                textDecoration: 'underline'
              }}
            >
              Volver al Menú Público
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 15px', paddingBottom: '7rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>Panel Pezgallo</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Modo editor</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onBack}
              className="luso-glass"
              style={{ padding: '10px 16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Ver Menú
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: '10px 16px', background: 'rgba(255, 77, 79, 0.2)', border: '1px solid rgba(255, 77, 79, 0.3)', borderRadius: '12px', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Salir
            </button>
          </div>
        </div>

        {/* Sync / Save Notification bar */}
        <div className="luso-glass" style={{ padding: '1.2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h4 style={{ fontWeight: 600 }}>Sincronización en la Nube</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Guarda tus cambios localmente o envíalos a GitHub/Vercel.</p>
          </div>
          <button
            onClick={handleSyncCloud}
            disabled={isSaving}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #2a9d8f, #264653)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(42, 157, 143, 0.3)',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            <Save size={18} /> {isSaving ? 'Guardando...' : 'Sincronizar Web'}
          </button>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('items')}
            className={activeTab === 'items' ? '' : 'luso-glass'}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'items' ? 'linear-gradient(135deg, var(--accent-blue), #0077b6)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'items' ? '0 4px 12px rgba(0, 119, 182, 0.3)' : 'none'
            }}
          >
            🧾 Editar Platillos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={activeTab === 'categories' ? '' : 'luso-glass'}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'categories' ? 'linear-gradient(135deg, var(--accent-blue), #0077b6)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'categories' ? '0 4px 12px rgba(0, 119, 182, 0.3)' : 'none'
            }}
          >
            🖼️ Imágenes & Categorías
          </button>
        </div>

        {/* TAB 1: Platillos EDIT */}
        {activeTab === 'items' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {menu.map((cat, catIdx) => (
              <div key={cat.category} className="luso-glass" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                
                {/* Category Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                    {cat.category} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({cat.items.length} platillos)</span>
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleMoveCategory(catIdx, 'up'); }} disabled={catIdx === 0} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                      <ChevronUp size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleMoveCategory(catIdx, 'down'); }} disabled={catIdx === menu.length - 1} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                      <ChevronDown size={18} />
                    </button>
                    {expandedCategory === catIdx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Category Items Accordion */}
                <AnimatePresence>
                  {expandedCategory === catIdx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}
                    >
                      {/* Dishes List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {cat.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '15px'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>{item.name}</span>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>{item.price}</span>
                                {item.tag && <span style={{ background: 'rgba(0,119,182,0.2)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{item.tag}</span>}
                              </div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.description}</p>
                            </div>
                            
                            {/* Controls */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button onClick={() => handleMoveItem(catIdx, itemIdx, 'up')} disabled={itemIdx === 0} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronUp size={16} /></button>
                              <button onClick={() => handleMoveItem(catIdx, itemIdx, 'down')} disabled={itemIdx === cat.items.length - 1} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronDown size={16} /></button>
                              <button onClick={() => handleStartEditItem(catIdx, itemIdx)} style={{ background: 'none', border: 'none', color: '#ffb703', cursor: 'pointer' }}><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteItem(catIdx, itemIdx)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Item form toggle */}
                      {isAddingItem === catIdx ? (
                        <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Nuevo Platillo</h4>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                              type="text"
                              placeholder="Nombre del platillo*"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                            />
                            <input
                              type="text"
                              placeholder="Precio (Ej: $95)*"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                              style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Descripción (Ej: Camarón, cebolla, pepino)"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                          />
                          <input
                            type="text"
                            placeholder="Etiqueta opcional (Ej: ⭐, Muy recomendada)"
                            value={newItem.tag}
                            onChange={(e) => setNewItem({ ...newItem, tag: e.target.value })}
                            style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                          />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <button onClick={() => setIsAddingItem(null)} style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => handleConfirmAddItem(catIdx)} style={{ flex: 1, padding: '10px', background: 'var(--accent-blue)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Añadir</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartAddItem(catIdx)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px dashed rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            marginTop: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <Plus size={16} /> Añadir platillo
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteCategory(catIdx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff4d4f',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          marginTop: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> Eliminar categoría completa
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <button
              onClick={handleAddCategory}
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: 'var(--glass-radius)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '15px'
              }}
            >
              <Plus size={20} /> Crear Nueva Categoría
            </button>
          </div>
        )}

        {/* TAB 2: Categorías & Imágenes EDIT */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {menu.map((cat, index) => (
              <div key={cat.category} className="luso-glass" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                
                {/* Image preview */}
                <div style={{
                  width: '120px',
                  aspectRatio: '16/9',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#040914',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.category} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: cat.imagePosition || 'center' }} 
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Sin foto</div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: '1 1 200px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{cat.category}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* File Upload Button */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id={`file-${index}`}
                        onChange={(e) => handleImageFileChange(e, index)}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor={`file-${index}`}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 500
                        }}
                      >
                        <ImageIcon size={14} /> Cambiar Foto / Recortar
                      </label>
                    </div>

                    {/* Image Position Slider */}
                    {cat.image && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '85px' }}>Posicionar Y:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={
                            cat.imagePosition === 'top' ? 0 : 
                            cat.imagePosition === 'bottom' ? 100 : 
                            cat.imagePosition === 'center' ? 50 : 
                            parseInt(cat.imagePosition?.replace(/[^\d]/g, '') || '50')
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...menu];
                            updated[index].imagePosition = `center ${val}%`;
                            saveLocalDraft(updated);
                          }}
                          style={{
                            flex: 1,
                            accentColor: 'var(--accent-blue)',
                            height: '4px'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', minWidth: '35px', textAlign: 'right' }}>
                          {cat.imagePosition?.replace('center ', '') || '50%'}
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3,8,18,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              className="luso-glass"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '450px',
                padding: '2rem',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setEditingItem(null)} 
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>Editar Platillo</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nombre*</label>
                  <input
                    type="text"
                    value={editingItem.item.name}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, name: e.target.value }
                    })}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Precio* (Ej: $90 o Orden: $220)</label>
                  <input
                    type="text"
                    value={editingItem.item.price}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, price: e.target.value }
                    })}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descripción</label>
                  <textarea
                    rows="3"
                    value={editingItem.item.description || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, description: e.target.value }
                    })}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Etiqueta (Ej: ⭐ o Muy recomendada)</label>
                  <input
                    type="text"
                    value={editingItem.item.tag || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, tag: e.target.value }
                    })}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                  <button 
                    onClick={() => setEditingItem(null)} 
                    style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleConfirmEditItem} 
                    style={{ flex: 2, padding: '12px', background: 'var(--accent-blue)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal overlay */}
      {tempImageUrl && cropTarget && (
        <ImageCropper
          imageUrl={tempImageUrl}
          onCrop={handleCropComplete}
          onCancel={() => {
            setTempImageUrl(null);
            setCropTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin;
