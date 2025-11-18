import React from 'react'
import Hero from './home/Hero'
import Carousel from './home/Carousel'
import Section1 from './home/Section1'
import Features from './home/Features'
import Testimonals from './home/Testimonals'
import bg_1 from "../assets/bg-1.svg"
import bg_2 from "../assets/bg-2.svg"
import bg_3 from "../assets/bg-3.svg"
import bg_full from "../assets/bg-full.png"

const Homepage = () => {
  return (
    <div className='ml-48 mt-6 mr-36 relative'>
        <div className='relative'>
        <Hero />
        <img src={bg_full} alt="bg 1" className='inset-0 z-0 max-w-2xl fixed mx-auto'/>
        {/* <img src={bg_2} alt="bg 1" className='inset-0 z-0 max-w-xl fixed right-0'/> */}
        
        <Carousel/>
        {/* <img src={bg_3} alt="bg 1" className='inset-0 z-0 max-w-xl fixed bottom-0'/> */}
        <Section1 />
        <Features />
        <Testimonals />
        </div>
    </div>
  )
}

export default Homepage