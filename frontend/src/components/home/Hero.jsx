import React from 'react'

const Hero = () => {
  return (
    <div className='flex justify-center text-center items-center relative z-10  '>
        <div className=''>
            <h1 className='font-poppins font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-dark-pink via-secondary-pink to-purple-700 mb-4 capitalize'>Master you study materials instantly</h1>
            <p className='text-secondary-black mb-6 max-w-160 mx-auto'>Generate smart, personalized flashcards from any notes, PDFs, slides, or images—all powered by advanced AI. Make learning faster, easier, and more effective.</p>
            <button className='bg-pink-800 px-4 py-2 rounded-md text-white'>Get started</button>
        </div>
    </div>
  )
}

export default Hero