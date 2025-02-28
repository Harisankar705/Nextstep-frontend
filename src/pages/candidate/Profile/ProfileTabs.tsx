import React from 'react'
import { ProfileTabsProps } from '../../../types/Candidate'
import { useNavigate } from 'react-router-dom'

export const ProfileTabs: React.FC<ProfileTabsProps>=({onTabChange}) => {
    const navigate=useNavigate()

    const tabs = ['Saved', ]
    const handleTabClick=(tab:string)=>{
        onTabChange?.(tab)
        if(tab==='Friends')
        {
            navigate('/')
        }
        if(tab==='Saved')
        {
            navigate('/saved')
        }
        
    }
  return (
      <div className="flex border-b border-gray-800 mt-8">
          {tabs.map((item) => (
              <button
                  key={item}
                  onClick={()=>handleTabClick(item)}
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
