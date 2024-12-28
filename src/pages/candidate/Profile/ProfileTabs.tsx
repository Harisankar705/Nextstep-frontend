import React from 'react'
import { ProfileTabsProps } from '../../../types/Candidate'

export const ProfileTabs: React.FC<ProfileTabsProps>=({activeTab,onTabChange}) => {
    const tabs = ['Posts', 'About', 'Friends', 'Photos', 'Videos']
  return (
      <div className="flex border-b border-gray-800 mt-8">
          {tabs.map((item) => (
              <button
                  key={item}
                  onClick={()=>onTabChange?.(item)}
                  className={`px-4 py-4 text-sm font-medium ${item === 'activeTab'
                      ? 'text-purple-500 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-gray-300'
                      }`}
              >
                  {item}
              </button>
          ))}
      </div>
  )
}
