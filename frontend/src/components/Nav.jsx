import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { CircleUser, CloudUpload, House, LayoutDashboard, SquareCheck, Upload } from 'lucide-react'

const Nav = () => {
  return (
    <div className='bg-dark-pink border border-dark-pink h-[95dvh] p-6 text-white flex flex-col  fixed rounded m-4 text-xs items-center justify-center gap-8'>
        <Link to='/' ><div className='flex flex-col items-center justify-center '><House /> <p>Home</p></div></Link>
        <Link to='/upload'><div className='flex flex-col items-center justify-center '><CloudUpload />  <p>Upload</p></div></Link>
        {/* <Link to='/review'><p>Review</p></Link> */}
        <Link to='/practice'><div className='flex flex-col items-center justify-center '><SquareCheck /> <p>Practice</p></div></Link>
        <Link to='/dashboard'><div className='flex flex-col items-center justify-center '><LayoutDashboard /><p>Dashboard</p></div></Link>
        <Link to='/profile'> <div className='flex flex-col items-center justify-center '><CircleUser /><p>Profile</p></div></Link>
        {/* <Link to='/signup'><p>Signup</p></Link> */}
    </div>
  )
}

export default Nav