// Mock interfaces to match our frontend needs
export interface Player {
  id: number;
  name: string;
  avatar: string;
  rank: number;
  previousRank: number;
  elo: number;
  peakElo?: number;
  wins: number;
  losses: number;
  clan: string;
  region: 'EU' | 'NA' | 'ASIA';
  level: number;
  mainClass: 'Knight' | 'Vanguard' | 'Footman' | 'Archer';
  faction: 'mason' | 'agatha';
  rankTier: 'Grandmaster' | 'Diamond' | 'Gold' | 'Bronze';
}

export class PlayFabService {
  static async login(customId: string): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }

  static async getLeaderboard(
    statName: string = "ELO",
    startPosition: number = 0,
    maxResults: number = 20
  ): Promise<Player[]> {
    // Mock implementation that matches our mock data structure
    return Promise.resolve([]);
  }

  static async updatePlayerStatistic(
    statName: string,
    value: number
  ): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }

  static async getPlayerProfile(playFabId: string): Promise<Player> {
    // Mock implementation that matches our mock data structure
    return Promise.resolve({
      id: 1,
      name: "Mock Player",
      avatar: "",
      rank: 1,
      previousRank: 1,
      elo: 2000,
      peakElo: 2100,
      wins: 100,
      losses: 0,
      clan: "VEN",
      region: "EU",
      level: 100,
      mainClass: "Knight",
      faction: "mason",
      rankTier: "Grandmaster"
    });
  }
} 