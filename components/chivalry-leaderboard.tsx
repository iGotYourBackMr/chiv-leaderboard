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
  isMobile?: boolean;
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
  onItemsPerPageChange,
  isMobile = false
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
      Grandmaster: 'bg-[#423810] text-[#FF4655]',  // Red
      Diamond: 'bg-[#1a2937] text-[#22D3EE]',      // Cyan
      Gold: 'bg-[#423810] text-[#FFD700]',         // Gold
      Bronze: 'bg-[#2b1a1a] text-[#B45309]',       // Bronze
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
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto">
          {/* Mobile/Tablet View: Ranks at top */}
          <div className="lg:hidden w-full min-w-[300px]">
            <RankTiersSidebar className="w-full" isMobile={true} showOnlyRanks={true} />
          </div>

          {/* Desktop View: Full sidebar on left */}
          <div className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <RankTiersSidebar className="sticky top-4" />
          </div>

          {/* Leaderboard - Visible on all screen sizes */}
          <div className="flex-grow min-w-[300px]">
            <div className="glass-container relative mx-0 lg:mx-0 md:p-0">
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

              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="table-header border-b border-slate-800/50">
                      <th className="min-w-[80px] w-[15%] sm:w-[10%] p-2 sm:p-4 font-medium">
                        <div className="flex items-center justify-start px-3 sm:px-0 sm:justify-start">
                          RANK {getSortIcon('rank')}
                        </div>
                      </th>
                      <th className="min-w-[160px] w-[45%] sm:w-[35%] p-2 sm:p-4 font-medium">
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
                        <div className="flex items-center justify-end px-3 sm:px-0 sm:justify-center">
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
                          <div className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-0">
                            {getRankIcon(player.rank)}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              player.rankTier === 'Grandmaster' ? 'bg-[#FF4655]/30' :  // Translucent Red
                              player.rankTier === 'Diamond' ? 'bg-[#22D3EE]/30' :      // Translucent Cyan
                              player.rankTier === 'Gold' ? 'bg-[#FFD700]/30' :         // Translucent Gold
                              'bg-[#B45309]/30'                                        // Translucent Bronze
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
                                player.rankTier === 'Grandmaster' ? 'text-[#FF4655]' :  // Red
                                player.rankTier === 'Diamond' ? 'text-[#22D3EE]' :      // Cyan
                                player.rankTier === 'Gold' ? 'text-[#FFD700]' :         // Gold
                                'text-[#B45309]'                                        // Bronze
                              }`}>
                                {player.name}
                              </span>
                              {getRankBadgeByTier(player.rankTier)}
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell p-4 text-center">
                          <span className="text-sm sm:text-base text-white">
                            {player.region}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4">
                          <div className="flex items-center justify-end px-3 sm:px-0 sm:justify-center">
                            <span className="text-sm sm:text-base">{player.elo}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell p-4 text-center">{player.wins}</td>
                        <td className="hidden sm:table-cell p-4 text-center">{player.losses}</td>
                        <td className="hidden sm:table-cell p-4 text-center">{player.clan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && sortedAndFilteredPlayers.length > 0 && (
                <div className="p-4 flex justify-center border-t border-blue-900/20 rounded-b-2xl">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="hover:bg-black/60 px-3 h-9 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 backdrop-blur-sm disabled:opacity-50 disabled:shadow-none"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-300" />
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => {
                        const showPage = page === 1 || 
                                        page === pagination.total_pages || 
                                        Math.abs(page - pagination.page) <= 1;

                        if (!showPage) {
                          if (page === 2 || page === pagination.total_pages - 1) {
                            return <span key={page} className="text-slate-600">...</span>;
                          }
                          return null;
                        }

                        return (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "ghost"}
                            onClick={() => handlePageChange(page)}
                            className={`${
                              pagination.page === page
                                ? "bg-blue-500/20 text-blue-200 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:bg-blue-500/30"
                                : "bg-black/40 hover:bg-black/60 text-slate-400 hover:text-slate-200 border-slate-700/50"
                            } px-3 h-9 min-w-[36px] rounded-xl border shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-200`}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.total_pages}
                      className="hover:bg-black/60 px-3 h-9 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 backdrop-blur-sm disabled:opacity-50 disabled:shadow-none"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet View: Recent Duels at bottom */}
          <div className="lg:hidden w-full mt-4 min-w-[300px]">
            <RankTiersSidebar className="w-full" isMobile={true} showOnlyDuels={true} />
          </div>
        </div>
      </div>

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
                    <span className={`text-lg font-semibold ${
                      selectedPlayer.rankTier === 'Grandmaster' ? 'text-[#FF4655]' :  // Red
                      selectedPlayer.rankTier === 'Diamond' ? 'text-[#22D3EE]' :      // Cyan
                      selectedPlayer.rankTier === 'Gold' ? 'text-[#FFD700]' :         // Gold
                      'text-[#B45309]'                                                // Bronze
                    }`}>
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
