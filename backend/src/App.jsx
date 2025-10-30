import React from 'react'
import MainLayout from './MainLayout'
import { Routes, Route } from 'react-router-dom'
import {Analytics, Orders, Products, Tables} from './pages'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/tables' element={<Tables/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/' element={<MainLayout/>}/>
      </Routes>
    </>
  )
}

export default App
