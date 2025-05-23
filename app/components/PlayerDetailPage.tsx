import { motion } from 'framer-motion';
import { FortniteStats, formatNumber, formatKD, formatWinRate } from '~/utils/fortniteApi';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  stats?: FortniteStats | null;
  isLoading?: boolean;
}

interface PlayerDetailPageProps {
  player: TeamMember;
  onBack: () => void;
}

export default function PlayerDetailPage({ player, onBack }: PlayerDetailPageProps) {
  const stats = player.stats?.stats?.all?.overall;

  // Calculate additional metrics from available data
  const getAdvancedStats = () => {
    if (!stats) return null;

    const matchesPlayed = stats.matches || 1;
    const scorePerMatch = Math.round(stats.score / matchesPlayed);
    const killsPerMatch = (stats.kills / matchesPlayed).toFixed(1);
    const deathsPerMatch = (stats.deaths / matchesPlayed).toFixed(1);
    const minutesPerMatch = stats.minutesPlayed ? Math.round(stats.minutesPlayed / matchesPlayed) : 0;
    const scorePerMinute = stats.minutesPlayed ? Math.round(stats.score / stats.minutesPlayed) : 0;

    return {
      scorePerMatch,
      killsPerMatch,
      deathsPerMatch,
      minutesPerMatch,
      scorePerMinute,
    };
  };

  const advancedStats = getAdvancedStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gaming-gray relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-fortnite-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-fortnite-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white mb-8 group"
        >
          <span className="text-xl group-hover:translate-x-[-4px] transition-transform">←</span>
          <span>Back to Team</span>
        </motion.button>

        {/* Player Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-gaming font-bold mb-4">
              <span className="text-gradient">{player.name}</span>
            </h1>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-2xl text-fortnite-blue font-bold uppercase tracking-wide">
              {player.role}
            </span>
            <div className="w-3 h-3 bg-fortnite-blue rounded-full" />
            <span className="text-neon-cyan font-bold">PRO PLAYER</span>
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {player.description}
          </p>

          {/* Status */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="w-4 h-4 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50" />
            <span className="text-neon-green font-bold">ONLINE & ACTIVE</span>
          </div>
        </motion.div>

        {stats ? (
          <>
            {/* Main Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              <div className="card-gaming text-center relative overflow-hidden group">
                <div className="text-4xl font-bold text-neon-cyan mb-2">
                  {formatNumber(stats.wins)}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Total Wins</div>
                <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">🏆</div>
              </div>

              <div className="card-gaming text-center relative overflow-hidden group">
                <div className="text-4xl font-bold text-fortnite-yellow mb-2">
                  {formatKD(stats.kd)}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">K/D Ratio</div>
                <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">⚔️</div>
              </div>

              <div className="card-gaming text-center relative overflow-hidden group">
                <div className="text-4xl font-bold text-fortnite-orange mb-2">
                  {formatWinRate(stats.winRate)}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Win Rate</div>
                <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">📈</div>
              </div>

              <div className="card-gaming text-center relative overflow-hidden group">
                <div className="text-4xl font-bold text-neon-green mb-2">
                  {formatNumber(stats.kills)}
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Total Kills</div>
                <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">💀</div>
              </div>
            </motion.div>

            {/* Performance Bars */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-gaming mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                <span className="text-gradient">Performance Overview</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Win Rate Bar */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-fortnite-orange mb-2">
                    {formatWinRate(stats.winRate)}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stats.winRate, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="bg-gradient-to-r from-fortnite-orange to-fortnite-yellow h-3 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400">Win Rate</span>
                </div>

                {/* K/D Bar */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-fortnite-yellow mb-2">
                    {formatKD(stats.kd)}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.kd / 5) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      className="bg-gradient-to-r from-fortnite-yellow to-neon-cyan h-3 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400">K/D Ratio</span>
                </div>

                {/* Score Efficiency */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-cyan mb-2">
                    {advancedStats.scorePerMinute}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((advancedStats.scorePerMinute / 100) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                      className="bg-gradient-to-r from-neon-cyan to-fortnite-blue h-3 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400">Score/Min</span>
                </div>
              </div>
            </motion.div>

            {/* Advanced Stats */}
            {advancedStats && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                <div className="card-gaming">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Score per Match</span>
                      <span className="text-neon-cyan font-bold">{formatNumber(advancedStats.scorePerMatch)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kills per Match</span>
                      <span className="text-fortnite-yellow font-bold">{advancedStats.killsPerMatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deaths per Match</span>
                      <span className="text-fortnite-orange font-bold">{advancedStats.deathsPerMatch}</span>
                    </div>
                  </div>
                </div>

                <div className="card-gaming">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-2">⏱️</span>
                    Time & Efficiency
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Matches</span>
                      <span className="text-neon-cyan font-bold">{formatNumber(stats.matches)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minutes per Match</span>
                      <span className="text-fortnite-yellow font-bold">{advancedStats.minutesPerMatch}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Score per Minute</span>
                      <span className="text-fortnite-orange font-bold">{advancedStats.scorePerMinute}</span>
                    </div>
                  </div>
                </div>

                <div className="card-gaming">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Combat Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Score</span>
                      <span className="text-neon-cyan font-bold">{formatNumber(stats.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Deaths</span>
                      <span className="text-fortnite-yellow font-bold">{formatNumber(stats.deaths)}</span>
                    </div>
                    {stats.minutesPlayed && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Played</span>
                        <span className="text-fortnite-orange font-bold">{Math.round(stats.minutesPlayed / 60)}h</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Player Summary */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card-gaming text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-gradient">Player Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-lg font-bold text-neon-cyan">
                    {stats.winRate > 20 ? 'Elite' : stats.winRate > 15 ? 'Expert' : stats.winRate > 10 ? 'Skilled' : 'Developing'}
                  </div>
                  <div className="text-sm text-gray-400">Skill Level</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-lg font-bold text-fortnite-yellow">
                    {stats.kd > 2.5 ? 'Aggressive' : stats.kd > 1.5 ? 'Balanced' : 'Strategic'}
                  </div>
                  <div className="text-sm text-gray-400">Playstyle</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-lg font-bold text-fortnite-orange">
                    {stats.wins > 1000 ? 'Veteran' : stats.wins > 500 ? 'Experienced' : stats.wins > 100 ? 'Rising' : 'Rookie'}
                  </div>
                  <div className="text-sm text-gray-400">Experience</div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-white mb-4">Stats Unavailable</h2>
            <p className="text-gray-400 text-lg">
              This player's profile may be set to private or stats are temporarily unavailable.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
