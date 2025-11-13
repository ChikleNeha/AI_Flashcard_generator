import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import '../App.css'

const Layout = () => {
  return (
    <div className='flex'>
        <Nav />
        <Outlet />
    </div>
  )
}

export default Layout