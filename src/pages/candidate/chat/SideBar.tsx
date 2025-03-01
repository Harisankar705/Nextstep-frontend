import { useEffect, useMemo, useState } from "react";
import { PlusCircle, Search, X } from "lucide-react";
import { ChatHistoryItem, SideBarProps } from "../../../types/Candidate";
import { debounce } from "lodash";
import Spinner from "../../../utils/Spinner";
import { getAllChats } from "../../../services/commonService";

export const SideBar: React.FC<SideBarProps> = ({ onSelectedChat, role }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
                (role === "user" ? chat.firstName : chat.companyName)
                  .toLowerCase()
                  .includes(query.toLowerCase())
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
        console.log("Fetched chat history:", response.data);
        if (Array.isArray(response.data.messages)) {
          setChatHistory(response.data.messages);
          setFilteredChats(response.data.messages);
          if (response.data.messages.length > 0) {
            onSelectedChat?.(response.data.messages[0]);
          }
        } else {
          console.error(
            "Messages are not in the expected format:",
            response.data
          );
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

  const extractUniqueChats = (messages: any) => {
    const chatMap = new Map();

    messages.forEach((message: any) => {
      const otherUserId =
        message.senderId === role ? message.receiverId : message.senderId;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          _id: otherUserId,
          lastMessage: message.content,
          timeStamp: message.timestamp,
        });
      }
    });

    return Array.from(chatMap.values());
  };

  const uniqueChats = extractUniqueChats(chatHistory);

  const sortedChats = uniqueChats.sort(
    (a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
  );

  const getImageUrl = (chat: ChatHistoryItem) => {
    if (role === "user" && chat.profilePicture) {
      return chat.profilePicture;
    } else if (role === "employer" && chat.logo) {
      return chat.logo;
    } else {
      return "";
    }
  };

  return (
    <div className="w-1/4 border-r border-gray-700 bg-[#1c1c1c] p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button className="p-2 hover:bg-[#2E2E2E] rounded-full">
          <PlusCircle className="w-6 h-6 text-[#008080]" />
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
        <Search
          className="absolute left-3 top-1/2 transform-translate-y-1/2 text-gray-400"
          size={20}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform-translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">Recent</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {sortedChats.slice(0, 5).map((chat) => (
            <div
              key={chat._id}
              className="flex flex-col items-center cursor-pointer hover:opacity-80"
              onClick={() => onSelectedChat && onSelectedChat(chat)}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#008080] p-1">
                <img
                  src={getImageUrl(chat)}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs mt-1 truncate max-w-[64px]">
                {role === "user" ? chat.firstName : chat.companyName}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">All Chats</h2>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="p-3 bg-[#2e2e2e] rounded-lg animate-pulse flex items-center space-x-3"
            >
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
                  <span className="font-semibold">
                    {role === "user" ? chat.firstName : chat.companyName}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(chat.timeStamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {chat.lastMessage} {/* Display the last message */}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            No chats available!
          </div>
        )}
      </div>
    </div>
  );
};
