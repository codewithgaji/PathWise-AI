import React from 'react'
import { Link } from 'react-router-dom'
import { Courselection } from '../components/Courselection'

const Home = () => {
  return (
    <div>
     <h1 className='text-7xl text-center items-center pt-20'>This is the landing page</h1>
    <Link to="/course-selection">
     < div className='flex justify-center items-center pt-10'>
       <button className=' border-4  p-10' >Login</button>
     </div>
     </Link>
    
     
    </div>
  )
}

export default Home