import { BookCopy, Lightbulb, Upload } from 'lucide-react'
import React from 'react'

const Section1 = () => {
  return (
    <div className='mb-30 relative z-10 '>
        <h2 className='capitalize text-4xl font-bold text-dark-pink font-poppins text-center m-6'>How it works</h2>
        <div className='flex justify-between'>
            <div className='flex flex-col items-center gap-4'>
                <Upload className='text-dark-pink' size={48} />
                <p className='text-gray-800 text-md font-bold'>Upload Your Material</p>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <Lightbulb className='text-dark-pink' size={48} />
                <p className='text-gray-800 text-md font-bold'>Automatic Flashcard Generation</p>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <BookCopy className='text-dark-pink' size={48} />
                <p className='text-gray-800 text-md font-bold'>Study & Practice</p>
            </div>
        </div>
    </div>
  )
}

export default Section1