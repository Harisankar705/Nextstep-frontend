import { Image, Info, Phone, PlusCircle, Send, ThumbsUp, Video } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { useSocket } from "../../../SocketContext"
import { Message } from "../../../types/Candidate"
import { SideBar } from "./SideBar"
import toast from "react-hot-toast"
import { fetchMessages } from "../../../services/commonService"
import { individualDetails } from "../../../services/adminService"
import { useParams } from "react-router-dom"

export const Chat = () => {
    const {userId ,role}=useParams()
    console.log('userId',userId)
    
  const [message, setMessage] = useState<string>('')  
  const [messages, setMessages] = useState<Message[]>([])  
  const [chatHistory, setChatHistory] = useState<Array<any>>([])  
  const [loading, setLoading] = useState(false)  
  const [userDetails, setUserDetails] = useState<any>(null)  
  const [selectedChat, setSelectedChat] = useState<any>(null)  

  const socket = useSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()  
  }, [messages])

  
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data])
      })
    }
    return () => {
      if (socket) {
        socket.off('receiveMessage')  
      }
    }
  }, [socket])

  
  const fetchChatHistory = async () => {
    try {
      setLoading(true)
      const response = await fetchMessages()
      const data = await response
      setChatHistory(data)
    } catch (error) {
      toast.error('Failed to fetch chat history')
    } finally {
      setLoading(false)
    }
  }

  
  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true)
      const response = await individualDetails(userId,'employer')
      console.log('fetchuserdetails',response)
      const data = await response
      setUserDetails(data)
    } catch (error) {
      toast.error('Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    if (selectedChat?.userId) {
      fetchUserDetails(selectedChat.userId)  
      fetchMessages()  
    }
  }, [selectedChat])

  const handleSend = () => {
    if (message.trim()) {
      socket?.emit('sendMessage', { text: message, userId: selectedChat?.userId })
      setMessage('')  
    }
  }

  
  return (
    <div className="flex h-screen bg-[#1C1C1C] text-white">
      <SideBar chatHistory={chatHistory}  />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#2E2E2E]">
              <img src={userDetails?.profilePicture || 'default-profile.png'} alt="Profile" className="w-full h-full rounded-full" />
            </div>
            <span className="font-semibold">{userDetails?.name || 'Loading...'}</span>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
              <Phone className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
              <Video className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sent ? 'bg-[#008080] text-white' : 'bg-[#2E2E2E] text-white'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 bg-[#2E2E2E] rounded-full p-2">
            <button className="p-2 hover:bg-[#3E3E3E] rounded-full">
              <PlusCircle className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-[#3E3E3E] rounded-full">
              <Image className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Aa"
              className="flex-1 bg-transparent focus:outline-none px-3"
            />
            {message ? (
              <button onClick={handleSend} className="p-2 hover:bg-[#3E3E3E] rounded-full text-[#008080]">
                <Send className="w-6 h-6" />
              </button>
            ) : (
              <button className="p-2 hover:bg-[#3E3E3E] rounded-full text-[#008080]">
                <ThumbsUp className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
