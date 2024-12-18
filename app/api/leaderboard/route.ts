import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable static optimization

export async function GET(request: Request) {
  try {
    // Get pagination parameters from the request URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';

    // Try the new paginated endpoint first
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/leaderboard?page=${page}&page_size=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 0 },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.warn('New endpoint failed, falling back to legacy endpoint');
    }

    // Fallback to the old endpoint if the new one fails
    const response = await fetch(`http://127.0.0.1:8000/leaderboard/${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      players: data.players,
      pagination: {
        total: data.players.length,
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: Math.ceil(data.players.length / parseInt(pageSize))
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