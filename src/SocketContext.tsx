import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContextType } from './types/Candidate';
export const SocketContext = createContext<SocketContextType | undefined>(undefined);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: false
    });
    const handleConnect = () => {
      console.log('Socket connected successfully');
      setSocket(newSocket);
      setIsConnected(true);
    };
    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      setTimeout(() => {
        if (!newSocket.connected) {
          newSocket.connect();
        }
      }, 1000);
    };
    const handleConnectError = (error: any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setTimeout(() => {
        newSocket.connect();
      }, 1000);
    };
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.connect();
    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};