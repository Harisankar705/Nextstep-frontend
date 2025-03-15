import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ChatHistoryItem, SideBarProps } from "../../../types/Candidate";
import { debounce } from "lodash";
import Spinner from "../../../utils/Spinner";
import { getAllChats } from "../../../services/commonService";

export const SideBar: React.FC<SideBarProps> = ({ onSelectedChat }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUserId,setCurrentUserId]=useState()
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatHistoryItem[]>([]);

  const debouncedFilterChats = useMemo(
    () =>
      debounce((query: string) => {
        if (!Array.isArray(chatHistory)) {
          setFilteredChats([]);
          return;
        }
        setFilteredChats(
          query.trim() === ""
            ? chatHistory
            : chatHistory.filter((chat) =>
                chat.sender.firstName.toLowerCase().includes(query.toLowerCase())
              )
        );
      }, 300),
    [chatHistory]
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const response = await getAllChats();
        console.log("Fetched chat history:", response);
    
        const { messages, currentUserId } = response.data;
        setCurrentUserId(currentUserId); // Set currentUserId state
        console.log(currentUserId)
        if (Array.isArray(messages)) {
          const uniqueChats = extractUniqueChats(messages, currentUserId);
          setChatHistory(uniqueChats);
          setFilteredChats(uniqueChats);
    
          if (uniqueChats.length > 0) {
            onSelectedChat?.(uniqueChats[0]); // Select the first chat by default
          }
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch chat history!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    debouncedFilterChats(searchQuery);
  }, [searchQuery]);

  const extractUniqueChats = (messages: ChatHistoryItem[], currentUserId: string|undefined) => {
    const chatMap = new Map();

    messages.forEach((message) => {
      const otherUser = message.sender._id === currentUserId ? message.receiver : message.sender;
      if (otherUser._id === currentUserId) {
        return;
      }

      if (!chatMap.has(otherUser._id) ||new Date(message.timestamp) > new Date(chatMap.get(otherUser._id).timestamp)) {
        chatMap.set(otherUser._id, {
          _id: otherUser._id,
          firstName: otherUser.firstName,
          lastMessage: message.lastMessage,
          timestamp: message.timestamp,
          profilePicture: otherUser.profilePicture,
        });
      }
    });

    return Array.from(chatMap.values());
  };

  const sortedChats = [...filteredChats].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getImageUrl = (chat: ChatHistoryItem) => chat.profilePicture || "";

  return (
    <div className="w-1/4 border-r border-gray-700 bg-[#1c1c1c] p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
        </button>
      </div>

      {loading && <Spinner loading={true} />}

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 rounded-full bg-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#008080]"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">All Chats</h2>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-3 bg-[#2e2e2e] rounded-lg animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : sortedChats.length > 0 ? (
          sortedChats.map((chat) => (
            <div
              key={chat._id}
              className="p-3 bg-[#2E2E2E] rounded-lg hover:bg-[#3E3E3E] transition-colors cursor-pointer flex items-center space-x-3"
              onClick={() => onSelectedChat && onSelectedChat(chat)}
            >
              <div className="w-10 h-10 rounded-full">
                <img
                  src={getImageUrl(chat)}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{chat.firstName}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">No chats available!</div>
        )}
      </div>
    </div>
  );
};
