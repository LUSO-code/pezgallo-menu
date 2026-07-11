import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import { menuData as staticMenuData } from './data/menuData';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash);
  const [menu, setMenu] = useState(staticMenuData);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Load local draft first for instant paint
    const localDraft = localStorage.getItem('pezgallo_menu_draft');
    if (localDraft) {
      try {
        setMenu(JSON.parse(localDraft));
      } catch (e) {
        setMenu(staticMenuData);
      }
    }

    // Fetch fresh data from cloud bucket in background
    const fetchCloudMenu = async () => {
      try {
        const response = await fetch('https://kvdb.io/pezgallo_bucket_7f1a9b2c3d/menu');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenu(data);
            localStorage.setItem('pezgallo_menu_draft', JSON.stringify(data));
          }
        }
      } catch (error) {
        console.warn('Failed to load menu from cloud, using fallback:', error);
      }
    };

    fetchCloudMenu();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPath]); // Re-load draft if path changes back to public

  const isAdminRoute = currentPath === '#/admin' || currentPath === '#admin';

  return (
    <>
      <div className="underwater-bg">
        <div className="underwater-bg-overlay"></div>
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>
      
      {isAdminRoute ? (
        <Admin onBack={() => { window.location.hash = ''; }} />
      ) : (
        <>
          <main>
            <Hero />
            <Menu menuData={menu} />
            <Gallery />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
