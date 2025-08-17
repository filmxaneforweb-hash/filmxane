import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (onMessage: (message: WebSocketMessage) => void) => {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3004', {
        transports: ['websocket'],
        autoConnect: true
      });

      socketRef.current.on('connect', () => {
        console.log('WebSocket bağlandı');
        socketRef.current?.emit('joinAdmin');
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket bağlantısı koptu');
      });

      socketRef.current.on('adminJoined', (data) => {
        console.log('Admin paneline bağlandın:', data);
      });

      // Mesajları dinle
      socketRef.current.on('videoAdded', (video) => {
        onMessage({ type: 'videoAdded', data: video });
      });

      socketRef.current.on('seriesAdded', (series) => {
        onMessage({ type: 'seriesAdded', data: series });
      });

      socketRef.current.on('statsUpdated', (stats) => {
        onMessage({ type: 'statsUpdated', data: stats });
      });

      socketRef.current.on('userAdded', (user) => {
        onMessage({ type: 'userAdded', data: user });
      });
    }
  }, [onMessage]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { socket: socketRef.current };
};
