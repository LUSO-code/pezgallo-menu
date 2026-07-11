import React from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
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
      
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}

export default App;
