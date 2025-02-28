import React from 'react'
import HashLoader from 'react-spinners/HashLoader'
const Spinner:React.FC<{loading:boolean}>=({loading})=>{
    if(!loading)return null
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <HashLoader color="#36d7b7" size={80} className='sm:size-60 md:size-80 lg:size-100'/>
        </div>
    )
}

export default Spinner
