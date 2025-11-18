import React from 'react'
import { BookOpenCheck, FileStack, FolderUp, SquareAsterisk } from 'lucide-react'

const Features = () => {
  return (
    <div className='my-10 relative z-10 '>
        <h2 className='capitalize text-4xl font-bold text-dark-pink font-poppins text-center m-6'>Features</h2>
        <div className='grid grid-cols-2 gap-6 text-center'>
            <div className='flex flex-col items-center '>
                <div className='bg-tertiary-pink rounded-4xl p-6'><FileStack className='text-dark-pink' size={48} /></div>
                <p className='text-gray-800 text-md font-bold mt-4 mb-1'>Supports Multiple Formats</p>
                <p className='text-gray-800'>Text, PDF, image, PPT, audio.</p>
            </div>
            <div className='flex flex-col items-center'>
                <div className='bg-secondary-pink rounded-4xl p-6'><SquareAsterisk className='text-dark-pink' size={48} /></div>
                <p className='text-gray-800 text-md font-bold  mt-4 mb-1'>Customizable Cards</p>
                <p className='text-gray-800 max-w-xs'>Edit, reorder, and group flashcards to create perfect decks.</p>
            </div>
            <div className='flex flex-col items-center'>
                <div className='bg-primary-pink rounded-4xl p-6'><BookOpenCheck className='text-dark-pink' size={48} /></div>
                <p className='text-gray-800 text-md font-bold  mt-4 mb-1'>Practice Modes</p>
                <p className='text-gray-800 max-w-xs'>Spaced repetition, quizzes, and interactive card flips.</p>
            </div>
            <div className='flex flex-col items-center'>
                <div className='bg-creame rounded-4xl p-6'><FolderUp className='text-dark-pink' size={48} /></div>
                <p className='text-gray-800 text-md font-bold  mt-4 mb-1'>Export Options</p>
                <p className='text-gray-800 max-w-xs'>Download as PDF, import to apps like Quizlet/Anki.</p>
            </div>
        </div>
    </div>
  )
}

export default Features