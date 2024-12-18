export default function Loading() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="glass-container p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-300">Loading leaderboard data...</p>
      </div>
    </div>
  );
} 