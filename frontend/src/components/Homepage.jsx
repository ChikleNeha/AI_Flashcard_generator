import React from 'react'
import Hero from './home/Hero'
import Carosel from './home/Carosel'
import Section1 from './home/Section1'
import Features from './home/Features'
import Testimonals from './home/Testimonals'

const Homepage = () => {
  return (
    <div className='ml-48 mt-6 mr-36'>
        <Hero />
        <Carosel />
        <Section1 />
        <Features />
        <Testimonals />
    </div>
  )
}

export default Homepage