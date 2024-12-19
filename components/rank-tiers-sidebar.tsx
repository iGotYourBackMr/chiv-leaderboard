import React, { useState } from 'react';
import { Shield, Diamond, Star, Menu, X } from 'lucide-react';

const RankTiersSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">Ranking Tiers</div>
        
        <div className="rank-tier grandmaster">
          <Shield className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Grandmaster</div>
            <div className="rank-elo">2000+ ELO</div>
          </div>
        </div>
        
        <div className="rank-tier master">
          <Shield className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Master</div>
            <div className="rank-elo">1800-2000 ELO</div>
          </div>
        </div>
        
        <div className="rank-tier diamond">
          <Diamond className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Diamond</div>
            <div className="rank-elo">1600-1800 ELO</div>
          </div>
        </div>
        
        <div className="rank-tier platinum">
          <Diamond className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Platinum</div>
            <div className="rank-elo">1400-1600 ELO</div>
          </div>
        </div>
        
        <div className="rank-tier gold">
          <Star className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Gold</div>
            <div className="rank-elo">1200-1400 ELO</div>
          </div>
        </div>
        
        <div className="rank-tier silver">
          <Star className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Silver</div>
            <div className="rank-elo">1000-1200 ELO</div>
          </div>
        </div>
        
        <div className="rank-tier bronze">
          <Star className="rank-icon" />
          <div className="rank-info">
            <div className="rank-name">Bronze</div>
            <div className="rank-elo">&lt;1000 ELO</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RankTiersSidebar; 