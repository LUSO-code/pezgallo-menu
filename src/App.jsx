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
    
    // Load local draft if available
    const localDraft = localStorage.getItem('pezgallo_menu_draft');
    if (localDraft) {
      try {
        setMenu(JSON.parse(localDraft));
      } catch (e) {
        setMenu(staticMenuData);
      }
    }

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
