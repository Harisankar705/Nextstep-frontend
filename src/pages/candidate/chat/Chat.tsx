import {
  Delete,
  MessagesSquare,
  MoreVertical,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import {useEffect, useRef, useState } from "react";
import { useSocket } from "../../../SocketContext";
import { Message, SelectedFileType, VideoCallAnswerData } from "../../../types/Candidate";
import { SideBar } from "./SideBar";
import toast from "react-hot-toast";
import {
  fetchUserMessages,
  getURL,
} from "../../../services/commonService";
import { individualDetails } from "../../../services/adminService";
import { useParams } from "react-router-dom";
import {
  getCompanyLogo,
  getProfilePictureURL,
} from "../../../utils/ImageUtils";
import { VideoCallUI } from "./VideoCall";
export const Chat = () => {
  const { userId, role } = useParams();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [caller, setCaller] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isStreamSet, setIsStreamSet] = useState(false);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { socket, isConnected } = useSocket();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isMuted,setIsMuted]=useState(true)
  const [isVideoEnabled,setIsVideoEnabled]=useState(true)
  const [callDuration,setCallDuration]=useState(0)
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<SelectedFileType | null>(
    null
  );
  const toggleMute=()=>{
    if(localStream)
    {
      localStream.getAudioTracks().forEach(track=>{
        track.enabled=!track.enabled
      })
      setIsMuted(!isMuted)
    }
  }
  const toggleVideo = () => {
  if (localStream) {
    localStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      if (localVideoRef.current) {
        if (!track.enabled) {
          localVideoRef.current.style.backgroundColor = '#000000';
          localVideoRef.current.srcObject = null;
        } else {
          localVideoRef.current.style.backgroundColor = 'transparent';
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(error => {
            toast.error('Error playing local video:', error);
          });
        }
      }
    });
    setIsVideoEnabled(!isVideoEnabled);
  }
};
  useEffect(() => {
    if (!socket) return;
    const connectSocket = () => {
      if (!isConnected) {
        socket.connect();
      }
    };
    const handleConnect = () => {
      if (userId) {
        socket.emit('join', userId);
        if (selectedChat?._id) {
          socket.emit('join', selectedChat._id);
        }
      }
    };
    socket.on('connect', handleConnect);
    socket.on('disconnect', connectSocket);
    socket.on('connect_error', connectSocket);
    connectSocket();
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', connectSocket);
      socket.off('connect_error', connectSocket);
    };
  }, [socket, userId, selectedChat?._id, isConnected]);
  useEffect(()=>{
    let interval:NodeJS.Timeout
    if(isCallInProgress)
    {
      interval=setInterval(()=>{
        setCallDuration(prev=>prev+1)
      },1000)
    }
    return ()=>{
      if(interval)
      {
        clearInterval(interval)
      }
      setCallDuration(0)
    }
  },[isCallInProgress])
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
  }, []);
  useEffect(() => {
    const videoElement = localVideoRef.current;
    if (videoElement && localStream) {
      videoElement.srcObject = localStream;
      setIsStreamSet(true);
    } else {
      setIsStreamSet(false);
    }
  }, [localStream]);  
  useEffect(() => {
    if (!socket) return;
    const handleVideoCallOffer = (data: {
      senderId: string;
      receiverId: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      if (data.senderId !== userId) {
        return;
      }
      setCaller(data);
      setIsReceivingCall(true);
    };
    socket.on("videoCallOffer", handleVideoCallOffer);
    return () => {
      socket.off("videoCallOffer", handleVideoCallOffer);
    };
  }, [socket, userId]);
  const startVideoCall = async () => {
    if (!isConnected) {
      toast.error("Reconnecting to chat. Please try again.");
      socket?.connect();
      return;
    }
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
      setLocalStream(stream);
      stream.getVideoTracks().forEach(track=>{
        track.enabled=true
      })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.google.com:19302" },
        ],
      });
      peerConnectionRef.current = peerConnection;
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket?.emit("videoCallOffer", {
        senderId: selectedChat._id, 
        receiverId: userId, 
        offer,
      });
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("newIceCandidate", {
            senderId: selectedChat._id, 
            receiverId: userId, 
            candidate: event.candidate,
          });
        }
      };
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "disconnected") {
          endVideoCall();
        }
      };
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      setIsCallInProgress(true);
    } catch (error) {
      toast.error("Error starting video call");
    }
  };
  const answerVideoCall = async () => {
    try {
      if (!caller || !caller.offer) {
        return;
      }
      // Get local stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.google.com:19302" },
        ],
      });
      peerConnectionRef.current = peerConnection;
      peerConnection.oniceconnectionstatechange = () => {
      };
      peerConnection.onconnectionstatechange = () => {
      };
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play()//remove the .catch
          }
        } 
      };
      await peerConnection.setRemoteDescription(new RTCSessionDescription(caller.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket?.emit("videoCallAnswer", {
        senderId: userId,
        receiverId: caller.senderId,
        answer,
      });
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("newIceCandidate", {
            senderId: selectedChat._id,
            receiverId: caller.senderId,
            candidate: event.candidate,
          });
        }
      };
      setIsCallInProgress(true);
      setIsReceivingCall(false);
      setCaller(null);
    } catch (error) {
      toast.error("Error answering video call");
      endVideoCall();
    }
  };
  useEffect(() => {
    if (socket && !isConnected) {
      socket.connect();
    }
  }, [socket, isConnected]);
  useEffect(() => {
    if (!socket) return;
    const handleNewICECandidate = async(data: {
      senderId: string;
      receiverId: string;
      candidate: RTCIceCandidate;
    }) => {
      if (!peerConnectionRef.current) {
        return;
      }
      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (error) {
        return
      }
    };
    socket.on("newICECandidate", handleNewICECandidate);
    return () => {
      socket.off("newICECandidate", handleNewICECandidate);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    const handleVideoCallAnswer = async (data: VideoCallAnswerData) => {
      if (!peerConnectionRef.current) return;
      if (!data.answer || !data.answer.type || !data.answer.sdp) {
        return;
      }
      try {
        const answerDescription: RTCSessionDescriptionInit = {
          type: data.answer.type,
          sdp: data.answer.sdp
        };
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answerDescription)
        );
      } catch (error) {
        toast.error("Error establishing connection");
      }
    };
    socket.on("videoCallAnswer", handleVideoCallAnswer);
    return () => {
      socket.off("videoCallAnswer", handleVideoCallAnswer);
    };
  }, [socket]);
  const endVideoCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCallInProgress(false);
    if (selectedChat?._id) {
      socket?.emit("videoCallHangUp", {
        senderId: selectedChat._id,
        receiverId: userId,
      });
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file) {
      toast.success("file selected");
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size should be less than 10MB");
      return;
    }
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        };
        reader.readAsDataURL(file);
      });
      setSelectedFile({
        file: file,
        preview: URL.createObjectURL(file),
        data: base64,
        name: file.name,
        type: file.type,
      });
    } catch (error) {
      toast.error("file processing error");
    } finally {
      setUploadProgress(0);
    }
  };
  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;
    const markMessagesAsSeen = () => {
      const unseenMessages = messages.filter(
        (msg) => msg.senderId === selectedChat._id && msg.status !== "seen"
      );
      if (unseenMessages.length > 0) {
        socket.emit("messageStatus", {
          messageIds: unseenMessages.map((msg) => msg._id),
          status: "seen",
          receiverId: selectedChat._id,
        });
      }
    };
    markMessagesAsSeen();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markMessagesAsSeen();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, selectedChat?._id, messages]);
  useEffect(() => {
    if (!socket) return;
    const handleMessageStatusUpdate = (data: {
      messageId: string;
      status: string;
      timestamp: string;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === data.messageId
            ? {
                ...msg,
                status: data.status,
                [`${data.status}At`]: data.timestamp,
              }
            : msg
        )
      );
    };
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);
    return () => {
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (message: Message) => {
      if (!message || !message.content) {
        return;
      }
      const isRelevantMessage =
        message.senderId === selectedChat?._id ||
        message.receiverId === selectedChat?._id ||
        message.senderId === userId ||
        message.receiverId === userId;
      if (!isRelevantMessage) {
        return;
      }
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg._id === message._id ||
            (msg.content === message.content &&
              msg.timestamp === message.timestamp)
        );
        if (isDuplicate) {
          return prevMessages;
        }
        const updatedMessages = [...prevMessages, message];
        return updatedMessages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    };
    const handleMessageSent = (data: { messageId: string; status: string }) => {
      // setMessages(prevMessages =>
      //   prevMessages.map(msg =>
      //     msg._id?.startsWith('temp-')
      //       ? { ...msg, _id: data.messageId, status: data.status }
      //       : msg
      //   )
      // );
    };
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("connect", () => {});
    socket.on("disconnect", (reason:string) => {
    });
    socket.on("connect_error", (error:any) => {
    });
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket, selectedChat?._id, userId]);
  useEffect(() => {
    if (socket && userId) {
      socket.emit("join", userId);
      if (selectedChat?._id) {
        socket.emit("join", selectedChat._id);
      }
    }
  }, [socket, userId, selectedChat?._id]);
  const handleSend = () => {
    if (!isConnected) {
      toast.error("Reconnecting to chat. Please try again.");
      socket?.connect();
      return;
    }
    if (message.trim() || selectedFile) {
      try {
        const fileData = selectedFile
          ? {
              data: selectedFile.data,
              name: selectedFile.name,
              type: selectedFile.type,
            }
          : null;
        const sendMessageWithRetry = () => {
          if (!isConnected) {
            setTimeout(sendMessageWithRetry, 1000);
            return;
          }
          socket?.emit("sendMessage", {
            senderId: selectedChat._id, 
            receiverId: userId,
            content: message,
            file: fileData,
          });
        };
        sendMessageWithRetry();
        setMessage("");
        setSelectedFile(null);
      } catch (error) {
        toast.error("Message send failed. Retrying...");
      }
    }
  };
  const FilePreview = ({ file, message }: { file: any; message?: Message }) => {
    const [secureURL, setSecureURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isS3File = Boolean(file?.url);
    const isImage = file?.type?.startsWith("image/");
    const fileURL = isS3File ? file.url : file.preview;
    const fileName = file.name || "File";
    useEffect(() => {
      const getSecureURL = async () => {
        if (isS3File && file.url) {
          setIsLoading(true); 
          try {
            const response = await getURL(file.url);
            setSecureURL(response.secureURL);
          } catch (error) {
            setSecureURL(file.url);
          } finally {
            setIsLoading(false); 
          }
        }
      };
      if (isS3File) {
        getSecureURL();
      }
    }, [isS3File, file.url]);
    const displayURL = isS3File ? secureURL : file.preview;
    return (
      <div className="rounded-lg p-3 bg-gray-800 max-w-xs">
        {isImage ? (
          <div className="relative">
            {isLoading ? (
              <div className="w-full h-[200px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-400">Loading image....</span>
              </div>
            ) : displayURL ? (
              <img
                src={displayURL}
                alt={fileName}
                className="max-w-full h-auto rounded-lg object-contain max-h-[300px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder-image.png"; 
                }}
              />
            ) : (
              <div className="w-full h-[200px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-400">
                  Failed to load image
                </span>
              </div>
            )}
            {!message && !isS3File && (
              <button
                onClick={() => {
                  if (typeof removeSelectedFile === "function") {
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
        {file.size && (
          <div className="text-xs text-gray-400 mt-1">
            {(file.size / 1024).toFixed(2)}KB
          </div>
        )}
      </div>
    );
  };
  const renderMessage = (msg: Message, index: number) => {
    const isSent = isMessageSent(msg);
    return (
      <div
        key={msg._id || `msg-${index}`}
        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
      >
        <div className="group relative">
          <div
            className={`w-full p-3 rounded-2xl ${
              isSent
                ? "bg-[#008080] text-white rounded-tr-none"
                : "bg-[#2E2E2E] text-white rounded-tl-none"
            }`}
          >
            {/* {msg.file && <FilePreview file={msg.file} message={msg}/>} */}
            {msg.content && (
              <div className="flex-1 mr-8 px-2 mt-2">{msg.content}</div>
            )}
            <div className="flex justify-between items-center mt-2 px-2">
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {renderMessageStatus(msg)}
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <MessageContextMenu message={msg} />
          </div>
        </div>
      </div>
    );
  };
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
  const handleDeleteMessage = async (messageId: string | undefined) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
    if (socket && isConnected) {
      socket.emit("deleteMessage", {
        messageId,
        senderId: userId,
        receiverId: selectedChat?._id,
      });
    } else {
      toast.error("Failed to delete messages");
    }
  };
  useEffect(() => {
    if (!socket) return;
    const handleMessageDeleted = (data: {
      messageId: string;
      deletedBy: string;
    }) => {
      setMessages((prevMessage) =>
        prevMessage.filter((msg) => msg._id !== data.messageId)
      );
    };
    socket.on("messageDeleted", handleMessageDeleted);
    return () => {
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket]);
  const MessageContextMenu = ({ message }: { message: Message }) => {
    const [isOpen, setIsOpen] = useState(false);
    const canDelete = message.senderId === selectedChat._id; 
    if (!canDelete) return null;
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute right-0 z-50 bg-[#2e2e2e] rounded-md shadow-lg border border-gray-700">
            <button
              onClick={() => {
                handleDeleteMessage(message._id);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-red-500 hover:bg-red-500  hover:text-white transition-colors duration-200 w-full"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };
  const fetchMutualMessages = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetchUserMessages(userId); 
      if (Array.isArray(response.messages)) {
        const sortedMessages = response.messages.sort(
          (a: Message, b: Message) =>
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
    return msg.receiverId === userId;
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
    if (!isMessageSent(msg)) return null;
    switch (msg.status) {
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
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
              <polyline points="16 4 22 10 16 16" />
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
              <polyline points="16 4 22 10 16 16" />
              <path d="M7 13l5 5L22 7" />
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
        {isCallInProgress &&( <VideoCallUI localStream={localStream}isMuted={isMuted} callDuration={callDuration} remoteStream={remoteStream} isVideoEnabled={isVideoEnabled} toggleMute={toggleMute} toggleVideo={toggleVideo} endVideoCall={endVideoCall}/>)}
          {isReceivingCall && (
          <div className="fixed inset-0 z-50 flex-col items-center justify-center bg-black bg-opacity-75">
            <div className="bg-[#2e2e2e] p-8 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 overflow-hidden">
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
              <h3 className="text-xl font-semibold mb-2">
                {role==='employer'?userDetails?.companyName:userDetails?.firstName}
              </h3>
              <p className="text-gray-400 mb-6">Incoming video call</p>
              <div className="flex justify-center space-x-4">
                <button onClick={answerVideoCall}
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">Accept</button>
                  <button
                  onClick={() => {
                    setIsReceivingCall(false);
                    setCaller(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-500"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
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
            <button
              className="p-2 hover:bg-[#2E2E2E] rounded-full  "
              disabled={!selectedChat?._id || isCallInProgress}
              onClick={startVideoCall}
            >
              <Video className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => renderMessage(msg, index))
          ) : (
            <EmptyState />
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
          {selectedFile && (
            <div className="mb-2 ">
              <FilePreview file={selectedFile} />
            </div>
          )}
          <div className="flex items-center space-x-2 bg-[#2E2E2E] rounded-full p-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.txt"
            />
            <button
              className="p-2 hover:bg-[#3E3E3E] rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent focus:outline-none px-3"
            />
            {message || selectedFile ? (
              <button
                onClick={handleSend}
                className="p-2 hover:bg-[#3E3E3E] rounded-full text-[#008080]"
              >
                <Send className="w-6 h-6" />
              </button>
            ) 
            :null}
          </div>
        </div>
      </div>
    </div>
  );
};
