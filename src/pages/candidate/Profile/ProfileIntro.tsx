import { GraduationCap, Home } from 'lucide-react';
import React from 'react'
import { ProfileHeaderProps } from '../../../types/Candidate';

export const ProfileIntro:React.FC<ProfileHeaderProps>= ({user,isOwnProfile}) => {
    const {aboutMe,education,location}=user
  return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Intro</h2>
          <p className="text-center mb-4">{aboutMe}</p>
          <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mb-4 transition duration-300">
              Edit Bio
          </button>
          <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <span>
                      {education && education.degree
                      ?`${education.degree} fromm ${education.institution} in ${education.year}`
                      :"No education details!"
                      }
                  </span>

              </div>
              <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-400" />
                  <span>{location || 'No location'}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-gray-400" />
                                        <span>{friends ? `${friends.length} friends` : 'No friends'}</span>
                                    </div> */}
          </div>
          {isOwnProfile && (
              <button className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mt-4 transition duration-300">
                  Edit details
              </button>
          )}
          
      </div>
  )
}
