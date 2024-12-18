'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="glass-container p-8 text-center max-w-md">
        <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="text-slate-300 mb-4">
          {error.message || 'Failed to load leaderboard data'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 