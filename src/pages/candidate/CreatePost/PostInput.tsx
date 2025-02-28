import React from 'react';
import { Image } from 'lucide-react';
import { PostInputProps } from '../../../types/Candidate';

export const PostInput: React.FC<PostInputProps> = ({ onClick, profilePicture, companyLogo }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow p-3 sm:p-4 mb-4">
      <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={onClick}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          ) : companyLogo ? (
            <img
              src={companyLogo}
              alt="Company logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 animate-pulse" />
          )}
        </div>

        <div className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 text-sm sm:text-base text-gray-400 transition-colors duration-200">
          What's on your mind?
        </div>
      </div>

      <div className="flex justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
        <button className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 px-2 py-1 sm:px-2 sm:py-2 rounded-lg transition-colors duration-200">
          <Image className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
          <span className="hidden xs:inline text-xs sm:text-sm">Photo/Video</span>
        </button>
      </div>
    </div>
  );
};
