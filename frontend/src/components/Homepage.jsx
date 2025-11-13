import React from 'react'
import Hero from './home/Hero'
import Carosel from './home/Carosel'
import Section1 from './home/Section1'

const Homepage = () => {
  return (
    <div className='mx-28 mt-6'>
        <Hero />
        <Carosel />
        <Section1 />
    </div>
  )
}

export default Homepage