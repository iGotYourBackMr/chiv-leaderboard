'use client';

import { useEffect, useState, useRef } from 'react';
import LeaderboardComponent from '@/components/chivalry-leaderboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [data, setData] = useState<{ 
    players: any[],
    pagination?: {
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }
  }>({ players: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Function to fetch initial data
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard?page=${currentPage}&pageSize=${itemsPerPage}`);
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Function to setup WebSocket connection
    const setupWebSocket = () => {
      const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        // Only update if we're on the same page as the update
        if (newData.pagination.page === currentPage && 
            newData.pagination.page_size === itemsPerPage) {
          setData(newData);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 1 second
        setTimeout(setupWebSocket, 1000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      };

      // Keep connection alive
      const keepAlive = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 30000);

      wsRef.current = ws;

      // Cleanup function
      return () => {
        clearInterval(keepAlive);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    };

    // Initial data fetch
    fetchData();

    // Setup WebSocket
    const cleanup = setupWebSocket();

    // Cleanup on component unmount
    return () => {
      cleanup();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (pageSize: number) => {
    setItemsPerPage(pageSize);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-slate-400">Loading leaderboard...</div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen p-4">
      <LeaderboardComponent 
        players={data.players} 
        pagination={data.pagination}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </main>
  );
} 