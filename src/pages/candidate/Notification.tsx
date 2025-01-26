import io from "socket.io-client";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/commonService";
import { X } from "lucide-react";
const socket = io("http://localhost:4000");
interface Notification {
  _id: string;
  read: boolean;
  sender: {
    firstName?: string;
    secondName?: string;
    companyName?: string;
  };
  content: string;
}
export const Notification = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnReadCount] = useState(0);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response: Notification[] = await getNotifications();
        setNotifications(response);
        setUnReadCount(response.filter((n) => !n.read).length);
      } catch (error) {
        console.error("error fetching notifications", error);
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
      console.error("Error marking notification as read", error);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed top-16 right-4 z-50">
      <div className="bg-white p-6  rounded-lg shadow-lg w-96 max-h-[400px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet!</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                onClick={() => handleNotificationClick(notification._id)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md mb-2  ${
                  !notification.read && "font-semibold bg-gray-100"
                }`}
              >
                {notification.content}-{" "}
                {notification.sender.firstName ||
                  notification.sender.companyName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
