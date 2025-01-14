import React from "react"
import { SearchResultItemProps } from "../../types/Candidate"
import { useNavigate } from "react-router-dom"
import { BriefcaseBusiness, Store, User } from "lucide-react"

export const SearchResultItem:React.FC<SearchResultItemProps> = ({
    result,onSelect
})=>{
    const navigate=useNavigate()
    const handleClick=()=>{
        
        
        
        if(onSelect)
        {
            onSelect(result)
        }
        else
        {
            switch(result.type)
            {
                case 'user':
                    navigate(`/profile/${result._id}`);
                    break
                case 'job':
                    navigate(`/job/${result._id}`);
                    break
                case 'company':
                    navigate(`/company/${result._id}`);
                    break

            }
        }
    }
    const getIcon=()=>{
        switch(result.type)
        {
            case 'user':
                return <User className="h-5 w-5 text-gray-500"/>
            case 'job':
                return <BriefcaseBusiness className="h-5 w-5 text-gray-500"/>
            case 'company':
                return <Store className="h-5 w-5 text-gray-500"/>
            default:
                return null
        }
    }
    return (
        <button onClick={handleClick}
        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors">{getIcon()}
        <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{result.name}</span>
            <span className="text-sm font-medium text-gray-500">{result.type}</span>
        </div>
        </button>
    )
}
  

