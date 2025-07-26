
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CareerPathPage from './components/CareerPath';
import { Courselection } from './components/Courselection';
import { Navbar } from './components/LandingPage/Navbar';
import { Footer } from './components/LandingPage/Footer';
import Roles from './components/Roles';
import Skills from './components/Skills';
import Assestment from './components/Assestment';
import Result from './components/Result'; 
import { useEffect, useRef, useState } from 'react';
import Test from './components/Test';

// Layout with navbar and footer
const MainLayout = () => (
  <>
    <Navbar />
    <AnimatedPageWrapper>
      <Outlet />
    </AnimatedPageWrapper>
    <Footer />
  </>
);

// Wrapper that adds animation to pages
const AnimatedPageWrapper = ({ children }) => {
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

// Wrap Routes in AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/course-selection" element={
          <AnimatedPageWrapper>
            <Courselection />
          </AnimatedPageWrapper>
        } />
        <Route path="/career-path" element={
          <AnimatedPageWrapper>
            <CareerPathPage />
          </AnimatedPageWrapper>
        } />
         <Route path="/job-roles" element={
          <AnimatedPageWrapper>
            <Roles />
          </AnimatedPageWrapper>
        } />
        <Route path="/skills" element={
          <AnimatedPageWrapper>
            <Skills />
          </AnimatedPageWrapper>
        } />
        <Route path="/assessment" element={
          <AnimatedPageWrapper>
            <Assestment />
          </AnimatedPageWrapper>
        } />
        <Route path="/result" element={
          <AnimatedPageWrapper>
            <Result />
          </AnimatedPageWrapper>
        } />
        <Route path="/test" element={
          <AnimatedPageWrapper>
            <Test />
          </AnimatedPageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
