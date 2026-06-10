import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import CartDrawer from '../components/CartDrawer/CartDrawer';
import LoginModal from '../components/LoginModal/LoginModal';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      
      {/* Sticky header and navbar container */}
      <div className="sticky top-0 z-[999] w-full shadow-md">
        <Header />
        <Navbar />
      </div>

      <main className="flex-grow w-full">
        <Outlet />
      </main>
      
      <Footer />

      {/* Global Modals and Drawer overlays */}
      <CartDrawer />
      <LoginModal />
    </div>
  );
}

export default MainLayout;
