import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';

interface RankTiersSidebarProps {
  className?: string;
  isMobile?: boolean;
  showOnlyRanks?: boolean;
  showOnlyDuels?: boolean;
}

const RankTiersSidebar = ({ 
  className = "", 
  isMobile = false,
  showOnlyRanks = false,
  showOnlyDuels = false
}: RankTiersSidebarProps) => {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    textRefs.current.forEach((ref, index) => {
      if (ref) {
        const containerWidth = ref.parentElement?.clientWidth || 0;
        const textWidth = ref.scrollWidth;
        const needsScroll = textWidth > containerWidth;
        
        // Calculate scroll percentage based on actual widths
        const scrollPercentage = needsScroll ? 
          ((textWidth - containerWidth) / containerWidth) * 100 : 0;

        ref.style.setProperty('--scroll-distance', `-${scrollPercentage}%`);
        ref.classList.toggle('animate', needsScroll);
      }
    });
  }, []);

  return (
    <aside className={`${className} bg-black/40 backdrop-blur-sm rounded-xl border border-slate-800/50 p-4 shadow-xl ${!isMobile ? 'h-full' : ''}`}>
      <style jsx>{`
        @keyframes scroll {
          0%, 25% { transform: translateX(0); }
          35%, 70% { transform: translateX(var(--scroll-distance, -50%)); }
          80%, 100% { transform: translateX(0); }
        }
        .scroll-text {
          white-space: nowrap;
          position: relative;
          width: 100%;
        }
        .scroll-text.animate {
          animation: scroll 10s infinite ease-in-out;
          animation-play-state: running;
        }
        .scroll-text.animate:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`${isMobile ? 'w-full overflow-x-auto' : ''}`}>
        {/* Ranking Tiers Section */}
        {(!showOnlyDuels || !isMobile) && (
          <div className={`${isMobile ? 'sm:pr-4' : ''}`}>
            <div className="text-[#C89B3C] text-center font-semibold mb-4 uppercase tracking-wider">
              Ranking Tiers
            </div>
            <div className="space-y-2">
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#FF4655]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#FF4655] drop-shadow-[0_0_3px_rgba(255,70,85,0.5)]" />
                <div>
                  <div className="text-[#FF4655] font-medium">Grandmaster</div>
                  <div className="text-[#5B5E65] text-sm">2000+ ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#FF8C00]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#FF8C00] drop-shadow-[0_0_3px_rgba(255,140,0,0.5)]" />
                <div>
                  <div className="text-[#FF8C00] font-medium">Master</div>
                  <div className="text-[#5B5E65] text-sm">1800-2000 ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#22D3EE]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#22D3EE] drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]" />
                <div>
                  <div className="text-[#22D3EE] font-medium">Diamond</div>
                  <div className="text-[#5B5E65] text-sm">1600-1800 ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#10B981]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#10B981] drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" />
                <div>
                  <div className="text-[#10B981] font-medium">Platinum</div>
                  <div className="text-[#5B5E65] text-sm">1400-1600 ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#FFD700]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#FFD700] drop-shadow-[0_0_3px_rgba(255,215,0,0.5)]" />
                <div>
                  <div className="text-[#FFD700] font-medium">Gold</div>
                  <div className="text-[#5B5E65] text-sm">1200-1400 ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#94A3B8]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#94A3B8] drop-shadow-[0_0_3px_rgba(148,163,184,0.5)]" />
                <div>
                  <div className="text-[#94A3B8] font-medium">Silver</div>
                  <div className="text-[#5B5E65] text-sm">1000-1200 ELO</div>
                </div>
              </div>
              
              <div className="bg-black/40 hover:bg-black/60 rounded-xl p-3 flex items-center gap-3 border border-[#B45309]/20 transition-all duration-200 min-w-[240px]">
                <Shield className="w-5 h-5 text-[#B45309] drop-shadow-[0_0_3px_rgba(180,83,9,0.5)]" />
                <div>
                  <div className="text-[#B45309] font-medium">Bronze</div>
                  <div className="text-[#5B5E65] text-sm">&lt;1000 ELO</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Duels Section */}
        {(!showOnlyRanks || !isMobile) && (
          <div className={`${isMobile ? '' : 'mt-6'}`}>
            <div className="text-[#C89B3C] text-center font-semibold mb-2 uppercase tracking-wider">
              Recent Duels
            </div>
            <ul className="space-y-2">
              {[
                { names: "KnightSlayer vs VanguardElite", time: "2 hours ago", color: "text-[#FF4655]" },
                { names: "SwordMaster vs ShieldBearer", time: "5 hours ago", color: "text-[#22D3EE]" },
                { names: "BattleMage vs WarriorKing", time: "1 day ago", color: "text-[#10B981]" },
                { names: "BladeRunner vs ArmorBreaker", time: "2 days ago", color: "text-[#FF4655]" },
                { names: "KnightSlayer vs BattleMage", time: "3 days ago", color: "text-[#22D3EE]" }
              ].map((duel, index) => (
                <li key={index} className="bg-black/40 rounded-xl p-3 min-w-[240px]">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 overflow-hidden mr-2">
                      <div 
                        ref={el => textRefs.current[index] = el}
                        className={`scroll-text ${duel.color} font-medium`}
                      >
                        {duel.names}
                      </div>
                    </div>
                    <span className="text-[#5B5E65] text-sm whitespace-nowrap">{duel.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RankTiersSidebar; 