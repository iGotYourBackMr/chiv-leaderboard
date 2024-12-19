"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sword,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  Skull,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Trophy,
  Flame,
  ShieldIcon,
  Menu,
  X,
  User,
} from 'lucide-react';
import Image from 'next/image';
import ParticleNetwork from './particle-network';
import RankTiersSidebar from './rank-tiers-sidebar';

/**
 * Chivalry 2 Leaderboard Component
 * 
 * This component displays a responsive leaderboard with the following features:
 * - Pagination with customizable items per page
 * - Search functionality for player names
 * - Region filtering (EU, NA, ASIA)
 * - Rank tier system with visual indicators
 * - Mobile-responsive design with detailed player view
 * - Faction-based styling (Mason/Agatha)
 * 
 * Integration Points:
 * 1. Player Interface: Update the Player type to match your data structure
 * 2. Rank Tiers: Modify getRankName and getRankBadgeColor for your ELO thresholds
 * 3. Region Handling: Update region types and getRegionColor for new regions
 * 4. Faction Styling: Customize mason/agatha classes in globals.css
 * 
 * Required Backend API Response:
 * {
 *   players: Player[];
 *   pagination: {
 *     total: number;
 *     page: number;
 *     page_size: number;
 *     total_pages: number;
 *   }
 * }
 */

type SortField = 'rank' | 'elo' | 'wins' | 'losses' | 'clan';
type SortDirection = 'asc' | 'desc';

// Add type for rank tiers
type RankTier = 'Grandmaster' | 'Diamond' | 'Gold' | 'Bronze';

interface Player {
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
  rankTier: RankTier;
}

interface LeaderboardProps {
  players: Player[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (pageSize: number) => void;
}

/**
 * Helper Functions
 * These functions handle various UI aspects of the leaderboard.
 * Modify these to match your game's specific requirements.
 */

// Helper functions
const getRankChangeIcon = (current: number, previous: number) => {
  const diff = previous - current;
  if (diff > 0) return <ArrowUpRight className="w-4 h-4 text-green-400" />;
  if (diff < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
  return <ArrowRight className="w-4 h-4 text-slate-400" />;
};

const getRankBadgeColor = (elo: number) => {
  if (elo >= 2000) return 'bg-yellow-500/20 text-yellow-400';
  if (elo >= 1800) return 'bg-purple-500/20 text-purple-400';
  if (elo >= 1600) return 'bg-cyan-500/20 text-cyan-400';
  if (elo >= 1400) return 'bg-blue-500/20 text-blue-400';
  if (elo >= 1200) return 'bg-yellow-600/20 text-yellow-600';
  if (elo >= 1000) return 'bg-slate-400/20 text-slate-400';
  return 'bg-orange-900/20 text-orange-700';
};

const getRankName = (elo: number) => {
  if (elo >= 2000) return 'Grandmaster';
  if (elo >= 1800) return 'Master';
  if (elo >= 1600) return 'Diamond';
  if (elo >= 1400) return 'Platinum';
  if (elo >= 1200) return 'Gold';
  if (elo >= 1000) return 'Silver';
  return 'Bronze';
};

const getClassIcon = (playerClass: Player['mainClass']) => {
  switch (playerClass) {
    case 'Knight': return <Sword className="w-4 h-4 text-red-400" />;
    case 'Vanguard': return <Sword className="w-4 h-4 text-orange-400" />;
    case 'Footman': return <ShieldIcon className="w-4 h-4 text-blue-400" />;
    case 'Archer': return <Target className="w-4 h-4 text-green-400" />;
  }
};

const getPlayerShortName = (name: string) => {
  // Map of player names to their 3-letter codes
  const shortNames: { [key: string]: string } = {
    'KnightSlayer': 'KnR',
    'VanguardElite': 'Van',
    'SwordMaster': 'Swo',
    'ShieldBearer': 'Shi',
    'BattleMage': 'Bat',
    'WarriorKing': 'War',
    'BladeRunner': 'Bla',
    'ArmorBreaker': 'Arm'
  };
  return shortNames[name] || name.substring(0, 3);
};

// Add custom circle icon component for filled circles
const FilledCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="4" />
  </svg>
);

const FilledCircleDotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="4" />
    <circle cx="8" cy="8" r="1.5" fill="#0d1117" />
  </svg>
);

// Add new helper function for region colors
const getRegionColor = (region: Player['region']) => {
  switch (region) {
    case 'EU': return 'bg-blue-500/5 text-blue-400';
    case 'NA': return 'bg-red-500/5 text-red-400';
    case 'ASIA': return 'bg-green-500/5 text-green-400';
    default: return 'bg-slate-500/5 text-slate-400';
  }
};

/**
 * Main Leaderboard Component
 * @param players - Array of player data from the API
 * @param pagination - Pagination information from the API
 * @param onPageChange - Callback for page changes
 * @param onItemsPerPageChange - Callback for items per page changes
 */

export default function LeaderboardComponent({ 
  players, 
  pagination,
  onPageChange,
  onItemsPerPageChange 
}: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'EU' | 'NA' | 'ASIA'>('ALL');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isRankLegendOpen, setIsRankLegendOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const getKDRatio = (kills: number, deaths: number) => {
    return (kills / Math.max(1, deaths)).toFixed(2);
  };

  const getRankBadgeByTier = (rankTier: RankTier) => {
    const badgeStyles = {
      Grandmaster: 'bg-[#423810] text-yellow-400',
      Diamond: 'bg-[#1a2937] text-cyan-400',
      Gold: 'bg-[#423810] text-yellow-600',
      Bronze: 'bg-[#2b1a1a] text-amber-700',
    } as const;

    return (
      <Badge 
        className={`px-3 py-1 h-6 flex items-center justify-center text-sm font-medium ${badgeStyles[rankTier] || 'bg-slate-500/20 text-slate-400'}`}
      >
        {rankTier}
      </Badge>
    );
  };

  // Sort and filter players
  const sortedAndFilteredPlayers = React.useMemo(() => {
    let filtered = [...players];
    
    // Filter by region
    if (selectedRegion !== 'ALL') {
      filtered = filtered.filter(player => player.region === selectedRegion);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort players
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'elo':
          comparison = b.elo - a.elo;
          break;
        case 'wins':
          comparison = b.wins - a.wins;
          break;
        case 'losses':
          comparison = b.losses - a.losses;
          break;
        case 'clan':
          comparison = b.clan.localeCompare(a.clan);
          break;
        default:
          comparison = a.rank - b.rank;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [players, searchQuery, selectedRegion, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronDown className="w-4 h-4 ml-1" /> : 
      <ChevronUp className="w-4 h-4 ml-1" />;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange(parseInt(value));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return null;
  };

  return (
    <>
      <ParticleNetwork />
      <div className="w-full max-w-7xl mx-auto p-4 relative flex">
        <RankTiersSidebar />
        
        <div className="flex-1 ml-4">
          {/* Main content container */}
          <div className="glass-container relative overflow-x-hidden sm:overflow-x-auto">
            {/* Header */}
            <div className="p-3 sm:p-6 border-b border-slate-800/50 leaderboard-header">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <img
                      src="/images/TOlogo.png"
                      alt="The Order Logo"
                      className="w-8 h-8 sm:w-12 sm:h-12 object-contain opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/20 to-[#0066cc]/20 blur-sm rounded-full" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c41e3a] via-slate-200 to-[#0066cc]">
                    The Order Ranked 1v1 Duels
                  </h1>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <span className="text-sm text-slate-400">Region:</span>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as typeof selectedRegion)}
                    className="custom-select px-3 sm:px-4 py-1 sm:py-2"
                  >
                    <option value="ALL" className="bg-[#1a2737] text-slate-200 py-1">All Regions</option>
                    <option value="EU" className="bg-[#1a2737] text-slate-200 py-1">EU</option>
                    <option value="NA" className="bg-[#1a2737] text-slate-200 py-1">NA</option>
                    <option value="ASIA" className="bg-[#1a2737] text-slate-200 py-1">ASIA</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2 sm:gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Player"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1 sm:py-2 text-sm sm:text-base border"
                  />
                  <Search className="w-4 h-4 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-blue-400/70" />
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="custom-select bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-8 text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-hidden">
              <table className="w-full text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="table-header border-b border-slate-800/50">
                    <th className="w-[15%] sm:w-[10%] p-2 sm:p-4 font-medium">
                      <div className="flex items-center justify-center sm:justify-start">
                        RANK {getSortIcon('rank')}
                      </div>
                    </th>
                    <th className="w-[45%] sm:w-[35%] p-2 sm:p-4 font-medium">
                      <div className="flex items-center pl-2 sm:pl-[35px]">
                        PLAYER
                      </div>
                    </th>
                    <th className="hidden sm:table-cell w-[10%] p-4 font-medium">
                      <div className="flex items-center justify-center">
                        REGION
                      </div>
                    </th>
                    <th className="w-[20%] sm:w-[15%] p-2 sm:p-4 font-medium text-center">
                      <div className="flex items-center justify-center">
                        ELO {getSortIcon('elo')}
                      </div>
                    </th>
                    <th className="hidden sm:table-cell w-[10%] p-4 font-medium cursor-pointer" onClick={() => handleSort('wins')}>
                      <div className="flex items-center justify-center">
                        <Target className="w-4 h-4 mr-1" />
                        WINS {getSortIcon('wins')}
                      </div>
                    </th>
                    <th className="hidden sm:table-cell w-[10%] p-4 font-medium cursor-pointer" onClick={() => handleSort('losses')}>
                      <div className="flex items-center justify-center">
                        <Skull className="w-4 h-4 mr-1" />
                        LOSSES {getSortIcon('losses')}
                      </div>
                    </th>
                    <th className="hidden sm:table-cell w-[10%] p-4 font-medium cursor-pointer" onClick={() => handleSort('clan')}>
                      <div className="flex items-center justify-center">
                        CLAN {getSortIcon('clan')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {sortedAndFilteredPlayers.map((player) => (
                    <tr 
                      key={player.id} 
                      className={`leaderboard-row group ${player.faction}-bg md:cursor-default cursor-pointer transition-all duration-200 hover:scale-[1.01] animate-fadeIn`}
                      style={{
                        animationDelay: `${player.rank * 50}ms`,
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease forwards'
                      }}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setSelectedPlayer(player);
                        }
                      }}
                    >
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          {getRankIcon(player.rank)}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            player.rankTier === 'Grandmaster' ? 'bg-[#423810]' :
                            player.rankTier === 'Diamond' ? 'bg-[#1a2937]' :
                            player.rankTier === 'Gold' ? 'bg-[#423810]' :
                            'bg-[#2b1a1a]'
                          }`}>
                            <span className="text-sm sm:text-base text-white">
                              {player.rank}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${player.faction === 'mason' ? 'bg-[#c41e3a]/20' : 'bg-[#0066cc]/20'}`}>
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 ${player.faction === 'mason' ? 'text-[#c41e3a]' : 'text-[#0066cc]'}`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm sm:text-base font-medium ${
                              player.rankTier === 'Grandmaster' ? 'text-yellow-400' :
                              player.rankTier === 'Diamond' ? 'text-cyan-400' :
                              player.rankTier === 'Gold' ? 'text-yellow-600' :
                              'text-amber-700'
                            }`}>
                              {player.name}
                            </span>
                            {getRankBadgeByTier(player.rankTier)}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell p-4 text-center">
                        <span className={`text-sm sm:text-base px-3 py-1 rounded-full ${getRegionColor(player.region)}`}>
                          {player.region}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-center">
                        <span className="text-sm sm:text-base">{player.elo}</span>
                      </td>
                      <td className="hidden sm:table-cell p-4 text-center">{player.wins}</td>
                      <td className="hidden sm:table-cell p-4 text-center">{player.losses}</td>
                      <td className="hidden sm:table-cell p-4 text-center">{player.clan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && sortedAndFilteredPlayers.length > 0 && (
              <div className="p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 sm:justify-between border-t border-blue-900/20 rounded-b-2xl">
                <select 
                  value={pagination.page_size}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="custom-select px-3 py-2 sm:px-4 sm:py-2 w-[140px] sm:w-auto text-sm sm:text-base"
                >
                  <option value="10" className="bg-[#1a2737] text-slate-200 py-1">10 per page</option>
                  <option value="20" className="bg-[#1a2737] text-slate-200 py-1">20 per page</option>
                  <option value="50" className="bg-[#1a2737] text-slate-200 py-1">50 per page</option>
                </select>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="hover:bg-blue-500/10 px-3 sm:px-4 h-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => {
                    // On mobile, only show current page and immediate neighbors
                    if (window.innerWidth < 640 && 
                        page !== 1 && 
                        page !== pagination.total_pages && 
                        Math.abs(page - pagination.page) > 1) {
                      if (Math.abs(page - pagination.page) === 2) {
                        return <span key={page} className="text-slate-600 px-1">...</span>;
                      }
                      return null;
                    }
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "ghost"}
                        onClick={() => handlePageChange(page)}
                        className={`${pagination.page === page ? 
                          "bg-blue-600 hover:bg-blue-500" : 
                          "hover:bg-blue-500/10"} px-3 sm:px-4 h-10 min-w-[36px] sm:min-w-[40px] text-sm sm:text-base`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages}
                    className="hover:bg-blue-500/10 px-3 sm:px-4 h-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog 
        open={selectedPlayer !== null} 
        onOpenChange={(open) => !open && setSelectedPlayer(null)}
      >
        <DialogContent className="glass-container border-slate-800/50 p-0 overflow-hidden md:hidden">
          {selectedPlayer && (
            <>
              <div className={`p-4 bg-gradient-to-r ${
                selectedPlayer.faction === 'mason' 
                  ? 'from-[#c41e3a]/20 via-[#c41e3a]/10' 
                  : 'from-[#0066cc]/20 via-[#0066cc]/10'
              } to-transparent border-b border-slate-800/50`}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedPlayer.faction === 'mason' ? 'bg-[#c41e3a]/20' : 'bg-[#0066cc]/20'
                    }`}>
                      <User className={`w-6 h-6 ${
                        selectedPlayer.faction === 'mason' ? 'text-[#c41e3a]' : 'text-[#0066cc]'
                      }`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-semibold ${selectedPlayer.faction}`}>
                      {selectedPlayer.name}
                    </span>
                    {getRankBadgeByTier(selectedPlayer.rankTier)}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {[
                  { label: 'Region', value: selectedPlayer.region.toUpperCase() },
                  { label: 'Wins', value: selectedPlayer.wins },
                  { label: 'Losses', value: selectedPlayer.losses },
                  { label: 'Clan', value: selectedPlayer.clan || 'None' }
                ].map((stat) => (
                  <div 
                    key={stat.label}
                    className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                      selectedPlayer.faction === 'mason' 
                        ? 'hover:bg-[#c41e3a]/10' 
                        : 'hover:bg-[#0066cc]/10'
                    }`}
                  >
                    <span className="text-slate-400">{stat.label}</span>
                    <span className={`text-lg font-medium ${selectedPlayer.faction}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
