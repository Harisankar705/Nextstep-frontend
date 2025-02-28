import { GraduationCap } from 'lucide-react';
import React from 'react'
import { ProfileHeaderProps } from '../../../types/Candidate';
export const ProfileIntro:React.FC<ProfileHeaderProps>= ({user}) => {
    const {aboutMe,education}=user
  return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-3">About yourself</h2>
          <p className="text-center mb-4">{aboutMe}</p>
         
          <div className="space-y-3 text-gray-300">
    {education && education.length > 0 ? (
        education.map((edu, index) => (
            <div key={index} className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <span>{`${edu.degree} from ${edu.institution} in ${edu.year}`}</span>
            </div>
        ))
    ) : (
        <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-400" />
            <span>No education details!</span>
        </div>
    )}
</div>
          {/* {isOwnProfile && (
              <button className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mt-4 transition duration-300">
                  Edit details
              </button>
          )} */}
      </div>
  )
}
