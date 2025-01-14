import { useEffect, useState } from "react";
import { useSocket } from "../../../SocketContext";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { ChatHistoryItem } from "../../../types/Candidate";
import { debounce, filter } from "lodash";

interface SideBarProps {
  chatHistory: ChatHistoryItem[]; 
}

export const SideBar: React.FC<SideBarProps> = ({ chatHistory = [] }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery,setSearchQuery]=useState<string>('')
  const [filteredChats,setFilteredChats]=useState<ChatHistoryItem[]>([])
  const socket = useSocket();
  const debouncedFilterChats=debounce((query:string)=>{
    if(query.trim()==='')
    {
        setFilteredChats(chatHistory)
    }
    else{
        const filtered=chatHistory.filter((chat)=>
        chatHistory.firstName.toLowerCase().includes(query.toLocaleUpperCase())||
        chatHistory.secondName.toLowerCase().includes(query.toLocaleUpperCase())
        
)
setFilteredChats(filtered)
    }
  },300)
useEffect(()=>{
    debouncedFilterChats(searchQuery)

},[searchQuery])
  return (
    <div className="w-1/4 border-r border-gray-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Search messages"
        value={searchQuery}
        onChange={(e)=>setSearchQuery(e.target.value)}
        className="w-full p-2 rounded-full bg-[#2E2E2E] mb-4 focus:outline-none"
      />
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="p-4 border-b border-gray-700 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-600 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-gray-600 rounded w-1/4 mt-2" />
              </div>
            ))
          : Array.isArray(filteredChats) && filteredChats.length > 0
          ? filteredChats.map((chat) => (
              <div
                key={chat._id}
                className="p-4 border-b border-gray-700 hover:bg-[#2E2E2E] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E2E2E]" />
                  <div className="flex-1">
                    <span className="font-semibold">{chat.contactName}</span>
                    <p className="text-sm text-gray-400">{chat.lastMessage}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(chat.timeStamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          : <p>No chats available</p>}
      </div>
    </div>
  );
};
