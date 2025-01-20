import {
  Delete,
  Image,
  Info,
  MessagesSquare,
  MoreVertical,
  Paperclip,
  Phone,
  PlusCircle,
  Send,
  ThumbsUp,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../SocketContext";
import { Message, MessageWithStatus } from "../../../types/Candidate";
import { SideBar } from "./SideBar";
import toast from "react-hot-toast";
import { fetchUserMessages, getURL, sendMessage } from "../../../services/commonService";
import { individualDetails } from "../../../services/adminService";
import { useParams } from "react-router-dom";
import {
  getCompanyLogo,
  getProfilePictureURL,
} from "../../../utils/ImageUtils";
interface SelectedFileType
{
  file:File,
  preview:string,
  data:string,
  name:string,
  type:string
}
export const Chat = () => {
  const { userId, role } = useParams();
  
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [filePreview,setFilePreview]=useState<string|null>(null)
  const fileInputRef=useRef<HTMLInputElement>(null)
  const MAX_FILE_SIZE=10*1024*1024
  const [uploadProgress,setUploadProgress]=useState<number>(0)
  const [selectedFile,setSelectedFile]=useState<SelectedFileType|null>(null)
  const [sentFileOpen,setSentFileOpen]=useState(false)

  const {socket,isConnected}=useSocket()
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "end" 
    });
  };
  const handleFileSelect=async(event:React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0]
    console.log('ffile',file?.type)
    if(!file)
    {
      
      return
    }
    if(file)
    {
      toast.success('file selected')
    }
    if(file.size>MAX_FILE_SIZE)
    {
      toast.error("File size should be less than 10MB")
      return
    }
    try {
    const base64=await new Promise<string>((resolve,reject)=>{
      const reader=new FileReader()
      reader.onload=()=>{
        console.log('file read successfully',reader.result)
        setFilePreview(reader.result as string)
        resolve(reader.result as string)
      }
      reader.onerror=(error)=>{
        console.log('file reader error',error)
        reject(error)
      }
      reader.onprogress=(event)=>{
        if(event.lengthComputable)
        {
          const progress=(event.loaded/event.total)*100 
          console.log("PROGRESS",progress)
          setUploadProgress(progress)
        }
      }
      reader.readAsDataURL(file)
    })
    setSelectedFile({
      file:file,
      preview:URL.createObjectURL(file),
      data:base64,
      name:file.name,
      type:file.type
    })
    } catch (error) {
      console.error('file processing error',error)
      toast.error('file processing error')
    }
    finally
    {
      setUploadProgress(0)
    }
    
   
    

  }
  useEffect(()=>{
    return ()=>{
      if(selectedFile?.preview)
      {
        URL.revokeObjectURL(selectedFile.preview)
      }
    }
  },[selectedFile])
  const removeSelectedFile=()=>{
    setSelectedFile(null)
    setFilePreview(null)
    if(fileInputRef.current)
    {
      fileInputRef.current.value=''
    }
  }
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logSocketEvent = (eventName: string, data: any) => {
    console.group(`%c🔌 Socket Event: ${eventName}`, 'color: green; font-weight: bold');
    
    
    
    
    console.groupEnd();
  };
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    const markMessagesAsSeen = () => {
      const unseenMessages = messages.filter(
        msg => 
          msg.senderId === selectedChat._id && 
          msg.status !== 'seen'
      );

      if (unseenMessages.length > 0) {
        socket.emit('messageStatus', {
          messageIds: unseenMessages.map(msg => msg._id),
          status: 'seen',
          receiverId: selectedChat._id
        });
      }
    };

    // Mark messages as seen when chat is opened or messages change
    markMessagesAsSeen();

    // Optional: Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        markMessagesAsSeen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, selectedChat?._id, messages]);

  // Modify socket listeners to handle seen status
  useEffect(() => {
    if (!socket) return;

    const handleMessageStatusUpdate = (data: {
      messageId: string, 
      status: string, 
      timestamp: string
    }) => {
      logSocketEvent('Message Status Update', data);

      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === data.messageId
            ? { 
                ...msg, 
                status: data.status,
                [`${data.status}At`]: data.timestamp
              }
            : msg
        )
      );
    };

    // Add listener for message status updates
    socket.on('messageStatusUpdate', handleMessageStatusUpdate);

    return () => {
      socket.off('messageStatusUpdate', handleMessageStatusUpdate);
    };
  }, [socket]);
  // Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      
      logSocketEvent('Receive Message', message);

      // Validate message
      if (!message || !message.content) {
        console.warn('Invalid message received');
        return;
      }

      // Detailed Logging
      console.group('Message Validation');
      
      
      
      
      console.groupEnd();

      // Check message relevance
      const isRelevantMessage = 
        message.senderId === selectedChat?._id || 
        message.receiverId === selectedChat?._id ||
        message.senderId === userId ||
        message.receiverId === userId;

      if (!isRelevantMessage) {
        console.warn('Message not relevant to current chat');
        return;
      }

      // Update messages state
      setMessages(prevMessages => {
        // Prevent duplicates
        const isDuplicate = prevMessages.some(
          msg => msg._id === message._id || 
                 (msg.content === message.content && 
                  msg.timestamp === message.timestamp)
        );

        if (isDuplicate) {
          console.warn('Duplicate message prevented');
          return prevMessages;
        }

        // Add new message
        const updatedMessages = [...prevMessages, message];

        // Sort messages by timestamp
        return updatedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    };

    // Message Sent Confirmation
    const handleMessageSent = (data: { messageId: string, status: string }) => {
      logSocketEvent('Message Sent', data);

      // setMessages(prevMessages => 
      //   prevMessages.map(msg => 
      //     msg._id?.startsWith('temp-') 
      //       ? { ...msg, _id: data.messageId, status: data.status } 
      //       : msg
      //   )
      // );
    };

    // Socket Event Listeners
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageSent', handleMessageSent);

    // Connection Debugging
    socket.on('connect', () => {
      
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    // Error Handling
    socket.on('connect_error', (error) => {
      console.error('Socket Connection Error:', error);
    });

    // Cleanup
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageSent', handleMessageSent);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket, selectedChat?._id, userId]);

  // Room Joining
  useEffect(() => {
    if (socket && userId) {
      // Join user's personal room
      socket.emit('join', userId);
      
      // Join selected chat room
      if (selectedChat?._id) {
        socket.emit('join', selectedChat._id);
      }

      
    }
  }, [socket, userId, selectedChat?._id]);

  const handleSend = () => {
    if (!isConnected) {
      toast.error("Socket is not connected");
      return;
    }
  
    if (message.trim()|| selectedFile) {
       ({
        senderId: selectedChat._id, // This should be the ID of the sender (current user)
        receiverId: userId, // This should be the ID of the receiver
        content: message,
        file:selectedFile
      });
  
      try {
        const fileData=selectedFile?{
          data:selectedFile.data,
          name:selectedFile.name,
          type:selectedFile.type,
        }:null
        socket?.emit("sendMessage", { 
          senderId: selectedChat._id, // Current user's ID
          receiverId: userId, // ID of the user being chatted with
          content: message,
          file:fileData
        });
  
        // Clear input
        setMessage("");
      } catch (error) {
        toast.error("Failed to send message");
      }
    }
  };
  const FilePreview = ({ file, message }: { file: any; message?: Message }) => {
    const [secureURL,setSecureURL]=useState<string|null>(null)
    const [isLoading,setIsLoading]=useState(false)
    const isS3File = Boolean(file?.url);
    const isImage = file?.type?.startsWith('image/');
    const fileURL = isS3File ? file.url : file.preview;
    const fileName = file.name || 'File';
    useEffect(()=>{
      const getSecureURL = async () => {
        if (isS3File && file.url) {
          setIsLoading(true); // Set loading to true
          try {
            const response = await getURL(file.url);
            console.log('getsecureurl', response);
            setSecureURL(response.secureURL);
          } catch (error) {
            console.error("Failed to get secure URL");
            setSecureURL(file.url);
          } finally {
            setIsLoading(false); // Set loading to false
          }
        }
      };
      
      if(isS3File)
      {
        getSecureURL()
      }
    },[isS3File,file.url])
    const displayURL=isS3File?secureURL:file.preview
  
    return (
      <div className="rounded-lg p-3 bg-gray-800 max-w-xs">
        {isImage ? (
          <div className="relative">
            {isLoading ? (
              <div className="w-full h-[200px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-400">Loading image....</span>
              </div>
            ):displayURL?(
<img 
              src={displayURL} 
              alt={fileName} 
              className="max-w-full h-auto rounded-lg object-contain max-h-[300px]" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder-image.png'; // Make sure you have a placeholder image
                console.error('Image failed to load:', displayURL);
              }}
            />
            ):(
              <div className="w-full h-[200px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-400">Failed to load image</span>
              </div>
            )}
            
            {!message && !isS3File && (
              <button 
                onClick={() => {
                  if (typeof removeSelectedFile === 'function') {
                    removeSelectedFile();
                  }
                }}
                className="absolute -top-2 -right-2 p-1 bg-gray-700 rounded-full hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Paperclip className="w-4 h-4" />
            <span className="text-xs truncate">{fileName}</span>
          </div>
        )}
        
        {uploadProgress > 0 && !message && !isS3File && (
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${uploadProgress}%` }} 
            />
          </div>
        )}
        
        {/* File size is only shown for local files */}
        {file.size && (
          <div className="text-xs text-gray-400 mt-1">
            {(file.size / 1024).toFixed(2)}KB
          </div>
        )}
      </div>
    );
  };
  const renderMessage=(msg:Message,index:number)=>{
    const isSent=isMessageSent(msg)
    return (
      <div 
      key={msg._id || `msg-${index}`}
      className={`flex ${isSent ?'justify-end':'justify-start'}`}>
        <div className="group relative">
          <div className={`w-full p-3 rounded-2xl ${
            isSent ? "bg-[#008080] text-white rounded-tr-none"
              : "bg-[#2E2E2E] text-white rounded-tl-none"
          }`}>
            {msg.file && <FilePreview file={msg.file} message={msg}/>}
            
            {msg.content && (
              <div className="flex-1 mr-8 px-2 mt-2">
                {msg.content}
              </div>
            )}
            <div className="flex justify-between items-center mt-2 px-2">
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleDateString([],{
                  hour:'2-digit',
                  minute:'2-digit',
                })}
              </div>
              {renderMessageStatus(msg)}
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <MessageContextMenu message={msg}/>
          </div>
        </div>
      </div>
    )
  }
  
 
  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const response = await individualDetails(userId, role as string);
      const data = await response[0];
      setUserDetails(data);
      setSelectedChat(response[0]);
    } catch (error) {
      
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMessage=async(messageId:string|undefined)=>{
    setMessages(prevMessages=>prevMessages.filter(msg=>msg._id!==messageId))
    if(socket && isConnected)
    {
      socket.emit('deleteMessage',{
        messageId,
        senderId:userId,
        receiverId:selectedChat?._id
      })
    }
    else
    {
      toast.error("Failed to delete messages")
    }
  }
  useEffect(()=>{
    if(!socket)return
    const handleMessageDeleted=(data:{
      messageId:string,
      deletedBy:string
    })=>{
      setMessages(prevMessage=>prevMessage.filter(msg=>msg._id!==data.messageId))
    }
    socket.on('messageDeleted',handleMessageDeleted)
    return ()=>{
      socket.off('messageDeleted',handleMessageDeleted)
    }
  },[socket])
  
  const MessageContextMenu=({message}:{message:Message})=>{
    const [isOpen,setIsOpen]=useState(false)
    
    
    const canDelete = message.senderId === selectedChat._id; // Check if the current user is the sender
    
    
    

    if(!canDelete)return null
    return (
      <div className="relative inline-block">
        <button onClick={()=>setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200">
          <MoreVertical className="w-4 h-4 text-gray-400"/>
        </button>
        {isOpen && (
          <div className="absolute right-0 z-50 bg-[#2e2e2e] rounded-md shadow-lg border border-gray-700">
            <button onClick={()=>{handleDeleteMessage(message._id); setIsOpen(false)}} className='flex items-center px-4 py-2 text-red-500 hover:bg-red-500  hover:text-white transition-colors duration-200 w-full'>
              <Delete className="w-4 h-4"/>
            </button>
          </div>

        )}
      </div>
    )
  }

  const fetchMutualMessages = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetchUserMessages(userId); // Fetch messages for the receiver
      
  
      if (Array.isArray(response.messages)) {
        const sortedMessages = response.messages.sort((a: Message, b: Message) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
  
        setSelectedChat({ _id: response.userId }); 
      } else {
        setMessages([]);
        toast.error("Messages data is not in the correct format!");
      }
    } catch (error) {
      toast.error("Failed to fetch user messages");
      console.error("Failed to fetch user messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
      fetchMutualMessages(userId);
    }
  }, [userId]);

  const isMessageSent = (msg: Message) => {
    
     return  msg.receiverId === userId;
  };

  const EmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <MessagesSquare className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No messages yet!</h3>
        <p className="text-center text-sm max-w-md">
          Start the conversation by sending a message. Your chat history will
          appear here!
        </p>
      </div>
    );
  };

  
  const renderMessageStatus = (msg: Message) => {
    // Only show status for sent messages
    if (!isMessageSent(msg)) return null;

  
    switch(msg.status) {
      case "sending":
        return (
          <div className="flex items-center space-x-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
        );
      
      case "sent":
        return (
          <div className="flex items-center space-x-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        );
      
      case "delivered":
        return (
          <div className="flex items-center space-x-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
              <polyline points="16 4 22 10 16 16"/>
            </svg>
          </div>
        );
      
      case "seen":
        return (
          <div className="flex items-center space-x-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
              <polyline points="16 4 22 10 16 16"/>
              <path d="M7 13l5 5L22 7"/>
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#1C1C1C] text-white">
      <SideBar chatHistory={chatHistory} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#2E2E2E]">
              <img
                src={
                  role === "employer"
                    ? getCompanyLogo(userDetails?.logo)
                    : getProfilePictureURL(userDetails?.profilePicture) ||
                      "default-profile.png"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="font-semibold">
              {role === "employer"
                ? userDetails?.companyName
                : userDetails?.firstName || "Loading..."}
            </span>
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
          {messages.length > 0 ? (
            messages.map((msg,index)=>renderMessage(msg,index))
          ) : (
            <EmptyState />
          )}
          <div ref={messagesEndRef} />
        </div>
        

        <div className="p-4 border-t border-gray-700">
          {selectedFile && (
            <div className="mb-2 ">
              <FilePreview file={selectedFile}/>
              </div>
          )}
          <div className="flex items-center space-x-2 bg-[#2E2E2E] rounded-full p-2">
            
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.txt"/>
            <button className="p-2 hover:bg-[#3E3E3E] rounded-full" onClick={()=>fileInputRef.current?.click()}>
              <Paperclip className="w-6 h-6"/>
             
              
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent focus:outline-none px-3"
            />
            {(message||selectedFile) ? (
              <button
                onClick={handleSend}
                className="p-2 hover:bg-[#3E3E3E] rounded-full text-[#008080]"
              >
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
  );
};