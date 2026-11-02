import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import CustomCursor from './components/CustomCursor/CustomCursor';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Services = lazy(() => import('./pages/Services/Services'));
const Work = lazy(() => import('./pages/Work/Work'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<div style={{ minHeight: '70vh' }} />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Router>
        <div className="ambient-grain" />
        <CustomCursor />
        <ScrollToTop />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </SmoothScrollProvider>
  );
}
