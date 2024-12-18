import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type PageKey = "1" | "2" | "3";

// Mock data for the leaderboard
const mockPlayers: Record<PageKey, Array<{
  id: number;
  name: string;
  avatar: string;
  rank: number;
  previousRank: number;
  elo: number;
  peakElo: number;
  wins: number;
  losses: number;
  clan: string;
  region: "EU" | "NA" | "ASIA";
  level: number;
  mainClass: "Knight" | "Vanguard" | "Footman" | "Archer";
  faction: "mason" | "agatha";
  rankTier: "Grandmaster" | "Diamond" | "Gold" | "Bronze";
}>> = {
  "1": [
    {
      id: 1,
      name: "Stridah",
      avatar: '',
      rank: 1,
      previousRank: 2,
      elo: 2150,
      peakElo: 2200,
      wins: 342,
      losses: 89,
      clan: "KILA",
      region: "EU",
      level: 999,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Grandmaster"
    },
    {
      id: 2,
      name: "Ziggylata",
      avatar: '',
      rank: 2,
      previousRank: 1,
      elo: 2120,
      peakElo: 2180,
      wins: 298,
      losses: 102,
      clan: "KILA",
      region: "NA",
      level: 950,
      mainClass: "Vanguard",
      faction: "agatha",
      rankTier: "Grandmaster"
    },
    {
      id: 3,
      name: "Montessoir",
      avatar: '',
      rank: 3,
      previousRank: 3,
      elo: 2080,
      peakElo: 2150,
      wins: 276,
      losses: 98,
      clan: "KILA",
      region: "EU",
      level: 925,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Grandmaster"
    },
    {
      id: 4,
      name: "Goof",
      avatar: '',
      rank: 4,
      previousRank: 5,
      elo: 2050,
      peakElo: 2100,
      wins: 265,
      losses: 110,
      clan: "VEN",
      region: "NA",
      level: 890,
      mainClass: "Vanguard",
      faction: "agatha",
      rankTier: "Grandmaster"
    },
    {
      id: 5,
      name: "Xylvion",
      avatar: '',
      rank: 5,
      previousRank: 4,
      elo: 2020,
      peakElo: 2080,
      wins: 245,
      losses: 105,
      clan: "VEN",
      region: "EU",
      level: 880,
      mainClass: "Footman",
      faction: "mason",
      rankTier: "Grandmaster"
    },
    {
      id: 6,
      name: "Proxeh",
      avatar: '',
      rank: 6,
      previousRank: 7,
      elo: 1980,
      peakElo: 2050,
      wins: 230,
      losses: 115,
      clan: "KILA",
      region: "EU",
      level: 850,
      mainClass: "Knight",
      faction: "agatha",
      rankTier: "Diamond"
    },
    {
      id: 7,
      name: "Fer",
      avatar: '',
      rank: 7,
      previousRank: 6,
      elo: 1950,
      peakElo: 2000,
      wins: 220,
      losses: 118,
      clan: "NOX",
      region: "NA",
      level: 820,
      mainClass: "Archer",
      faction: "mason",
      rankTier: "Diamond"
    },
    {
      id: 8,
      name: "Kenzo",
      avatar: '',
      rank: 8,
      previousRank: 9,
      elo: 1920,
      peakElo: 1980,
      wins: 210,
      losses: 125,
      clan: "NOX",
      region: "EU",
      level: 800,
      mainClass: "Vanguard",
      faction: "agatha",
      rankTier: "Diamond"
    },
    {
      id: 9,
      name: "Sophax",
      avatar: '',
      rank: 9,
      previousRank: 8,
      elo: 1890,
      peakElo: 1950,
      wins: 200,
      losses: 130,
      clan: "FCA",
      region: "EU",
      level: 780,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Diamond"
    },
    {
      id: 10,
      name: "Hexen",
      avatar: '',
      rank: 10,
      previousRank: 11,
      elo: 1860,
      peakElo: 1920,
      wins: 190,
      losses: 135,
      clan: "FCA",
      region: "NA",
      level: 760,
      mainClass: "Footman",
      faction: "agatha",
      rankTier: "Diamond"
    }
  ],
  "2": [
    {
      id: 11,
      name: "Moose",
      avatar: '',
      rank: 11,
      previousRank: 10,
      elo: 1840,
      peakElo: 1900,
      wins: 185,
      losses: 140,
      clan: "VEN",
      region: "EU",
      level: 740,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Diamond"
    },
    {
      id: 12,
      name: "Spook",
      avatar: '',
      rank: 12,
      previousRank: 13,
      elo: 1820,
      peakElo: 1880,
      wins: 180,
      losses: 145,
      clan: "KILA",
      region: "NA",
      level: 720,
      mainClass: "Vanguard",
      faction: "agatha",
      rankTier: "Diamond"
    },
    {
      id: 13,
      name: "Lionheart",
      avatar: '',
      rank: 13,
      previousRank: 12,
      elo: 1800,
      peakElo: 1860,
      wins: 175,
      losses: 150,
      clan: "NOX",
      region: "EU",
      level: 700,
      mainClass: "Footman",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 14,
      name: "Tempest",
      avatar: '',
      rank: 14,
      previousRank: 15,
      elo: 1780,
      peakElo: 1840,
      wins: 170,
      losses: 155,
      clan: "FCA",
      region: "NA",
      level: 680,
      mainClass: "Knight",
      faction: "agatha",
      rankTier: "Gold"
    },
    {
      id: 15,
      name: "Blade",
      avatar: '',
      rank: 15,
      previousRank: 14,
      elo: 1760,
      peakElo: 1820,
      wins: 165,
      losses: 160,
      clan: "VEN",
      region: "EU",
      level: 660,
      mainClass: "Vanguard",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 16,
      name: "Shadow",
      avatar: '',
      rank: 16,
      previousRank: 17,
      elo: 1740,
      peakElo: 1800,
      wins: 160,
      losses: 165,
      clan: "KILA",
      region: "NA",
      level: 640,
      mainClass: "Archer",
      faction: "agatha",
      rankTier: "Gold"
    },
    {
      id: 17,
      name: "Storm",
      avatar: '',
      rank: 17,
      previousRank: 16,
      elo: 1720,
      peakElo: 1780,
      wins: 155,
      losses: 170,
      clan: "NOX",
      region: "EU",
      level: 620,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 18,
      name: "Thunder",
      avatar: '',
      rank: 18,
      previousRank: 19,
      elo: 1700,
      peakElo: 1760,
      wins: 150,
      losses: 175,
      clan: "FCA",
      region: "NA",
      level: 600,
      mainClass: "Footman",
      faction: "agatha",
      rankTier: "Gold"
    },
    {
      id: 19,
      name: "Frost",
      avatar: '',
      rank: 19,
      previousRank: 18,
      elo: 1680,
      peakElo: 1740,
      wins: 145,
      losses: 180,
      clan: "VEN",
      region: "EU",
      level: 580,
      mainClass: "Vanguard",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 20,
      name: "Phoenix",
      avatar: '',
      rank: 20,
      previousRank: 21,
      elo: 1660,
      peakElo: 1720,
      wins: 140,
      losses: 185,
      clan: "KILA",
      region: "NA",
      level: 560,
      mainClass: "Knight",
      faction: "agatha",
      rankTier: "Gold"
    }
  ],
  "3": [
    {
      id: 21,
      name: "Dragon",
      avatar: '',
      rank: 21,
      previousRank: 20,
      elo: 1640,
      peakElo: 1700,
      wins: 135,
      losses: 190,
      clan: "NOX",
      region: "EU",
      level: 540,
      mainClass: "Vanguard",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 22,
      name: "Griffin",
      avatar: '',
      rank: 22,
      previousRank: 23,
      elo: 1620,
      peakElo: 1680,
      wins: 130,
      losses: 195,
      clan: "FCA",
      region: "NA",
      level: 520,
      mainClass: "Footman",
      faction: "agatha",
      rankTier: "Gold"
    },
    {
      id: 23,
      name: "Raven",
      avatar: '',
      rank: 23,
      previousRank: 22,
      elo: 1600,
      peakElo: 1660,
      wins: 125,
      losses: 200,
      clan: "VEN",
      region: "EU",
      level: 500,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 24,
      name: "Wolf",
      avatar: '',
      rank: 24,
      previousRank: 25,
      elo: 1580,
      peakElo: 1640,
      wins: 120,
      losses: 205,
      clan: "KILA",
      region: "NA",
      level: 480,
      mainClass: "Archer",
      faction: "agatha",
      rankTier: "Gold"
    },
    {
      id: 25,
      name: "Bear",
      avatar: '',
      rank: 25,
      previousRank: 24,
      elo: 1560,
      peakElo: 1620,
      wins: 115,
      losses: 210,
      clan: "NOX",
      region: "EU",
      level: 460,
      mainClass: "Vanguard",
      faction: "mason",
      rankTier: "Gold"
    },
    {
      id: 26,
      name: "Eagle",
      avatar: '',
      rank: 26,
      previousRank: 27,
      elo: 1540,
      peakElo: 1600,
      wins: 110,
      losses: 215,
      clan: "FCA",
      region: "NA",
      level: 440,
      mainClass: "Knight",
      faction: "agatha",
      rankTier: "Bronze"
    },
    {
      id: 27,
      name: "Hawk",
      avatar: '',
      rank: 27,
      previousRank: 26,
      elo: 1520,
      peakElo: 1580,
      wins: 105,
      losses: 220,
      clan: "VEN",
      region: "EU",
      level: 420,
      mainClass: "Footman",
      faction: "mason",
      rankTier: "Bronze"
    },
    {
      id: 28,
      name: "Lion",
      avatar: '',
      rank: 28,
      previousRank: 29,
      elo: 1500,
      peakElo: 1560,
      wins: 100,
      losses: 225,
      clan: "KILA",
      region: "NA",
      level: 400,
      mainClass: "Vanguard",
      faction: "agatha",
      rankTier: "Bronze"
    },
    {
      id: 29,
      name: "Tiger",
      avatar: '',
      rank: 29,
      previousRank: 28,
      elo: 1480,
      peakElo: 1540,
      wins: 95,
      losses: 230,
      clan: "NOX",
      region: "EU",
      level: 380,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Bronze"
    },
    {
      id: 30,
      name: "Panther",
      avatar: '',
      rank: 30,
      previousRank: 31,
      elo: 1460,
      peakElo: 1520,
      wins: 90,
      losses: 235,
      clan: "FCA",
      region: "NA",
      level: 360,
      mainClass: "Archer",
      faction: "agatha",
      rankTier: "Bronze"
    }
  ]
} as const;

export async function GET(request: Request) {
  try {
    // Get pagination parameters from the request URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Get the requested page of players
    const pageKey = page.toString() as PageKey;
    const players = mockPlayers[pageKey] || [];

    return NextResponse.json({
      players: players,
      pagination: {
        total: Object.values(mockPlayers).reduce((acc, curr) => acc + curr.length, 0),
        page: page,
        page_size: pageSize,
        total_pages: Object.keys(mockPlayers).length
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