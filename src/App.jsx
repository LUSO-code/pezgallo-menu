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
      <div className="underwater-bg"></div>
      
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
