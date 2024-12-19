function getRankBadge(elo) {
    let badge;

    if (elo >= 2000) {
        badge = {
            icon: '⚔️',
            name: 'GRANDMASTER',
            color: '#ff4655',
            bgColor: 'rgba(255, 70, 85, 0.1)',
            borderColor: 'rgba(255, 70, 85, 0.3)'
        };
    } else if (elo >= 1800) {
        badge = {
            icon: '🗡️',
            name: 'MASTER',
            color: '#ff8c00',
            bgColor: 'rgba(255, 140, 0, 0.1)',
            borderColor: 'rgba(255, 140, 0, 0.3)'
        };
    } else if (elo >= 1600) {
        badge = {
            icon: '💎',
            name: 'DIAMOND',
            color: '#00ffff',
            bgColor: 'rgba(0, 255, 255, 0.1)',
            borderColor: 'rgba(0, 255, 255, 0.3)'
        };
    } else if (elo >= 1400) {
        badge = {
            icon: '🔷',
            name: 'PLATINUM',
            color: '#00ff9d',
            bgColor: 'rgba(0, 255, 157, 0.1)',
            borderColor: 'rgba(0, 255, 157, 0.3)'
        };
    } else if (elo >= 1200) {
        badge = {
            icon: '🏅',
            name: 'GOLD',
            color: '#ffd700',
            bgColor: 'rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.3)'
        };
    } else if (elo >= 1000) {
        badge = {
            icon: '🥈',
            name: 'SILVER',
            color: '#c0c0c0',
            bgColor: 'rgba(192, 192, 192, 0.1)',
            borderColor: 'rgba(192, 192, 192, 0.3)'
        };
    } else {
        badge = {
            icon: '🥉',
            name: 'BRONZE',
            color: '#cd7f32',
            bgColor: 'rgba(205, 127, 50, 0.1)',
            borderColor: 'rgba(205, 127, 50, 0.3)'
        };
    }

    return `<span class="rank-badge" style="color: ${badge.color}; background: ${badge.bgColor}; border: 1px solid ${badge.borderColor}">
        ${badge.icon} ${badge.name}
    </span>`;
} 