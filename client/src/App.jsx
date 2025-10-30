import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';
import OrderStatus from './pages/OrderStatus';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast'; 

const App = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === '/status';

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '0.9rem',
          },
        }}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/order' element={<Order />} />
        <Route path='/status' element={<OrderStatus />} />
      </Routes>
    </>
  );
};

export default App;
