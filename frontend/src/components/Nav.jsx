import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const Nav = () => {
  return (
    <div className='bg-dark-pink h-dvh p-6 text-white flex flex-col gap-6 fixed'>
        <Link to='/' className=''><p>Home</p></Link>
        <Link to='/upload'><p>Upload</p></Link>
        <Link to='/review'><p>Review</p></Link>
        <Link to='/practice'><p>Practice</p></Link>
        <Link to='/dashboard'><p>Dashboard</p></Link>
        <Link to='/profile'><p>Profile</p></Link>
    </div>
  )
}

export default Nav