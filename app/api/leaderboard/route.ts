import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock data for the leaderboard
const mockPlayers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Player ${i + 1}`,
  avatar: '',
  rank: i + 1,
  previousRank: i + 2,
  elo: 2000 - (i * 10),
  peakElo: 2100 - (i * 8),
  wins: 100 - i,
  losses: Math.floor(i / 2),
  clan: ['VEN', 'KLA', 'FCA', 'NOX'][Math.floor(Math.random() * 4)],
  region: ['EU', 'NA', 'ASIA'][Math.floor(Math.random() * 3)],
  level: 100 - Math.floor(Math.random() * 50),
  mainClass: ['Knight', 'Vanguard', 'Footman', 'Archer'][Math.floor(Math.random() * 4)],
  faction: Math.random() > 0.5 ? 'mason' : 'agatha',
  rankTier: (i < 5) ? 'Grandmaster' :
           (i < 20) ? 'Diamond' :
           (i < 50) ? 'Gold' : 'Bronze'
}));

export async function GET(request: Request) {
  try {
    // Get pagination parameters from the request URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPlayers = mockPlayers.slice(startIndex, endIndex);

    return NextResponse.json({
      players: paginatedPlayers,
      pagination: {
        total: mockPlayers.length,
        page: page,
        page_size: pageSize,
        total_pages: Math.ceil(mockPlayers.length / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 