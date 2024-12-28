import React from 'react'
import { getImageURL } from '../../../utils/ImageUtils'
import { Image } from 'lucide-react'
import { PostInputProps } from '../../../types/Candidate'

export const PostInput:React.FC<PostInputProps>=({onClick,profilePicture}) => {
  return (
      <div className="bg-gray-900 border border-gray-900 rounded-lg shadow p-4 mb-4">
            <div className='flex gap-4 cursor-pointer'onClick={onClick}>
              <div className="w-10 h-10 rounded-full overflow-hidden">
              {profilePicture ? (
                <img src={getImageURL(profilePicture,'profile-pictures')}
                alt='profile'
                className='w-full h-full object-cover'/>
              ):(
                <div className='w-full h-full bg-gray-700 animate-pulse'/>
              )}
              </div>
              <div className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 text-gray-400">
                  What's on your mind!
              </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
              <button className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 px-2 py-2 rounded-lg transition-colors duration-200">
                  <Image className="h-6 w-6 text-green-500" />
                  <span>Photo/video</span>
              </button>
          </div>
      </div>
  )
}
