import { Bookmark, Icon, Image, MoreHorizontal, Users } from 'lucide-react'
import React from 'react'
import Navbar from '../../utils/Navbar';
const Skelton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)
const LeftSideBar = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <a href="#" className='flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'>
    <Icon className='h-6 w-6' />
    <span className='text-sm font-medium'>{children}</span>
  </a>
)
const Home = () => {
  return (
    <div className='min-h-screen bg-gray-100' >
      <Navbar/>
      <div className='flex'>
        <div className='w-[360px] fixed left-0  top-0 h-screen p-4 overflow-y-auto'>
          <div className='space-y-2'>
            <div className='items-center gap-2 mb-4'>
              <div className='w-10 h-10 rounded-full overflow-hidden'>
              </div>
            </div>
            <LeftSideBar icon={Users}>Friends</LeftSideBar>
            <LeftSideBar icon={Bookmark}>Saved</LeftSideBar>
           
            
          </div>
        </div>
        
        <main className='flex-1 ml-[360px] mr-[360px] p-4'>
          
          <div className='bg-white rounded-lg shadow p-4 mb-4'>
            <div className='flex gap-4'>
              <div className='w-10 h-10 rounded-full overflow-hidden'>
                <Skelton className='w-full h-full' />
              </div>
              <div className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500'>
                What's on your mind!
              </div>

            </div>
            <div className='flex justify-between mt-4 pt-4 border-t'>
              <button className='flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-2 py-2 rounded-lg'>
                <Image className='h-6 w-6 text-green-500' />
                <span>Photo/video</span>
              </button>

            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-white rounded-lg shadow p-4 mb-4'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-10 h-10 rounded-full overflow-hidden'>
                  <Skelton className='w-full h-full' />
                </div>
                <div className='flex-1'>
                  <Skelton className='h-4 w-32 mb-2' />
                  <Skelton className='h-3 w-24' />
                </div>
                <button className='text-gray-500'>
                  <MoreHorizontal className='h-6 w-6' />
                </button>
              </div>
              <Skelton className='w-full h-full' />
              <div className='flex gap-2'>
                <Skelton className='h-8 w-20' />
                <Skelton className='h-8 w-20' />
                <Skelton className='h-8 w-20' />
              </div>
            </div>
          ))}

        </main>
      </div>


    </div>
  )
}

export default Home
