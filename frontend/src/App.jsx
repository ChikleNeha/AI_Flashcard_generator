import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import Upload from './components/Upload'
import Review from './components/Review'
import Practice from './components/Practice'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import Layout from './components/Layout'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Homepage />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/review' element={<Review />} />
          <Route path='/practice' element={<Practice />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App