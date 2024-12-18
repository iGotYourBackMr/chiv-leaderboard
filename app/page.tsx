'use client';

import { useEffect, useState } from 'react';
import LeaderboardComponent from '@/components/chivalry-leaderboard';

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

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/leaderboard?page=${currentPage}&pageSize=${itemsPerPage}`);
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data when page or items per page changes
    fetchData();
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