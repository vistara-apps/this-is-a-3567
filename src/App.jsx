import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import StateGuide from './pages/StateGuide'
import Recording from './pages/Recording'
import Scripts from './pages/Scripts'
import Profile from './pages/Profile'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="gradient-bg min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide/:state" element={<StateGuide />} />
            <Route path="/recording" element={<Recording />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  )
}

export default App