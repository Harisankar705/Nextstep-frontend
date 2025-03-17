import { useEffect, useState } from "react";
import {getNotifications,markNotificationAsRead,} from "../../services/commonService";
import { LoaderIcon, X } from "lucide-react";
import { INotification } from "../../types/Candidate";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";
export const Notification= ({isOpen,onClose}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenPost?:(postId:string)=>void
  notification?:INotification
}) => {
  const [loading,setLoading]=useState(true)
  const {socket}=useSocket()
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnReadCount] = useState(0);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true)
      try { 
        const response: INotification[] = await getNotifications();
        console.log("RESPONSE",response)
        setNotifications(response);
        setUnReadCount(response.filter((n) => !n.read).length);
      } catch (error) {
        toast.error("error fetching notifications");
      }
      finally{
        setLoading(false)
      }
    };
    if (isOpen) {
      fetchNotification();
    }
    
    },[isOpen])
    useEffect(()=>{
      if(!socket)return
      const handleNewNotification=(newNotification:INotification)=>{
        setNotifications([newNotification, ...notifications]);
        setUnReadCount((prevCount) => prevCount + 1);
      }
      socket.on("newNotification",handleNewNotification);
      return () => {
        socket.off("newNotification");
      };
    }, [socket]);
   
  const handleNotificationClick = async (notification:INotification) => {
    try {
      await markNotificationAsRead(notification._id);
      setNotifications(
        notifications.map((n) =>
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
      setUnReadCount((prevCount) => Math.max(prevCount-1,0));
      if(notification.link)
      {
        navigate(notification.link)
        onClose()
      }
    } catch (error) {
      toast.error("Error marking notification as read");
      console.error("Error marking notification as read",error);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed top-16 right-4 z-50">
      <div className="bg-black p-6  rounded-lg shadow-lg w-96 max-h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold">Notifications ({unreadCount})</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {loading ? (
      <LoaderIcon className="w-4 h-4 animate-spin"/>
    ):notifications.length===0 ? (
      <p className="text-gray-500">No notifications</p>
    ): (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-900 rounded-md mb-2  ${
                  !notification.read && "font-semibold bg-gray"
                }`}
              >
              <div className="flex items-center">
                {notification.senderModel==='Employer'? (
                  <img src={notification.senderInfo.logo}
                  className="w-8 h-8 rounded-full mr-2"/>
                ):(
                  <img src={notification.senderInfo.profilePicture}
                  className="w-8 h-8 rounded-full mr-2"/>
                )}
                <div>
                  <p className="font-semibold">
                    {/* {notification.senderModel==='Employer'? notification.senderInfo.companyName :notification.senderInfo.firstName} */}
                  </p>
                  <p>{notification.content}</p>
                </div>
              </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
