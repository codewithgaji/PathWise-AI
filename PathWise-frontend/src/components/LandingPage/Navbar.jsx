import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div>
         <div className=' flex justify-center align-middle items-center h-14'>
            <div className='flex bg-zinc-700 border-2 absolute top-10 justify-between items-center rounded-full p-6 text-white w-[40em]  text-2xl'>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
             </div>
        </div>
    </div>
  )
}
