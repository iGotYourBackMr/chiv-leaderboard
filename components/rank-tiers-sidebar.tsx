import React from 'react';
import { Shield } from 'lucide-react';

const RankTiersSidebar = () => {
  return (
    <aside className="w-[280px] bg-[#0B0E13] rounded-xl border border-[#1E2328] p-4">
      <div className="text-[#C89B3C] text-center font-semibold mb-4">
        RANKING TIERS
      </div>
      
      <div className="space-y-2">
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FF4655]" />
          <div>
            <div className="text-[#FF4655] font-medium">Grandmaster</div>
            <div className="text-[#5B5E65] text-sm">2000+ ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FF8C00]" />
          <div>
            <div className="text-[#FF8C00] font-medium">Master</div>
            <div className="text-[#5B5E65] text-sm">1800-2000 ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#22D3EE]" />
          <div>
            <div className="text-[#22D3EE] font-medium">Diamond</div>
            <div className="text-[#5B5E65] text-sm">1600-1800 ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#10B981]" />
          <div>
            <div className="text-[#10B981] font-medium">Platinum</div>
            <div className="text-[#5B5E65] text-sm">1400-1600 ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FFD700]" />
          <div>
            <div className="text-[#FFD700] font-medium">Gold</div>
            <div className="text-[#5B5E65] text-sm">1200-1400 ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#94A3B8]" />
          <div>
            <div className="text-[#94A3B8] font-medium">Silver</div>
            <div className="text-[#5B5E65] text-sm">1000-1200 ELO</div>
          </div>
        </div>
        
        <div className="bg-[#0F1419] rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#B45309]" />
          <div>
            <div className="text-[#B45309] font-medium">Bronze</div>
            <div className="text-[#5B5E65] text-sm">&lt;1000 ELO</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RankTiersSidebar; 