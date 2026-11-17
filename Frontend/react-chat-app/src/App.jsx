import { useState } from 'react'
import { Routes, Route } from 'react-router'
import './App.css'
import Home from "./components/home.jsx"
import Register from "./components/Register.jsx"
import Login from "./components/Login.jsx"
import Dashboard from "./components/Dashboard.jsx"

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
