// useWebSocket.js
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<unknown[]>([]);
  const [status, setStatus] = useState('disconnected');
  const token = localStorage.getItem('token');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Add Bearer token to URL
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setStatus('connected');
      // Send auth immediately after connection
      if (ws.current) {
        ws.current.send(JSON.stringify({
          type: 'auth',
          authorization: `Bearer ${token}`
        }));
      }
    };

    ws.current.onclose = () => setStatus('disconnected');
    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, token]);

  const sendMessage = (message: Record<string, unknown>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        ...message,
        authorization: `Bearer ${token}`
      }));
    }
  };

  return { messages, status, sendMessage };
};