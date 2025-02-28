import io from "socket.io-client";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/commonService";
import { LoaderIcon, X } from "lucide-react";
import { INotification } from "../../types/Candidate";
import toast from "react-hot-toast";
const socket = io(import.meta.env.VITE_API_BASE_URL);
export const Notification= ({isOpen,onClose}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenPost?:(postId:string)=>void
  notification?:INotification
}) => {
  const [loading,setLoading]=useState(true)
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnReadCount] = useState(0);
  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true)
      try {
        const response: INotification[] = await getNotifications();
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
    socket.on("newNotification", (newNotification) => {
      setNotifications([newNotification, ...notifications]);
      setUnReadCount((prevCount) => prevCount + 1);
    });
    return () => {
      socket.off("newNotification");
    };
  }, [isOpen]);
  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnReadCount((prevCount) => prevCount - 1);
    } catch (error) {
      toast.error("Error marking notification as read");
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
      <LoaderIcon className="w-4 h-4"/>
    ):notifications.length===0 ? (
      <p className="text-gray-500">No notification tes</p>
    ): (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                onClick={() => handleNotificationClick(notification._id)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-900 rounded-md mb-2  ${
                  !notification.read && "font-semibold bg-gray-500"
                }`}
              >
              <div className="flex items-center">
                {notification.senderModel==='Employer'? (
                  <img src={notification.sender.logo}
                  className="w-8 h-8 rounded-full mr-2"/>
                ):(
                  <img src={notification.sender.profilePicture}
                  className="w-8 h-8 rounded-full mr-2"/>
                )}
                <div>
                  <p className="font-semibold">
                    {notification.senderModel==='Employer'? notification.sender.companyName :notification.sender.firstName}
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
