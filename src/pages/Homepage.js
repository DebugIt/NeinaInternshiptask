import Navbar from '@/components/Navbar'
import { TableComponent } from '@/components/TableComponent'
import React from 'react'

const Homepage = () => {
  return (
    <>
        <div id="container">
            <Navbar />
            <div className='md:mx-16 my-2 md:my-5'>
                <TableComponent />
            </div>
        </div>
    </>
  )
}

export default Homepage