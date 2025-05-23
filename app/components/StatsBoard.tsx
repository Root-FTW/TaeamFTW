import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAllTeamStats, calculateTeamTotals, formatNumber, formatKD, formatWinRate, FortniteStats } from '~/utils/fortniteApi';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon?: string;
  delay?: number;
}

function StatCard({ title, value, subtitle, color, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="card-gaming text-center relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/10 to-${color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Icon */}
      {icon && (
        <div className="text-4xl mb-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className={`text-4xl md:text-5xl font-bold text-${color} mb-2`}>
          {value}
        </div>
        <div className="text-white font-semibold text-lg mb-1">
          {title}
        </div>
        {subtitle && (
          <div className="text-gray-400 text-sm">
            {subtitle}
          </div>
        )}
      </div>

      {/* Animated Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        viewport={{ once: true }}
        className={`absolute bottom-0 left-0 h-1 bg-${color} origin-left`}
      />
    </motion.div>
  );
}

function LoadingCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="card-gaming text-center"
    >
      <div className="animate-pulse">
        <div className="h-12 bg-gray-700 rounded mb-4" />
        <div className="h-6 bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
      </div>
    </motion.div>
  );
}

export default function StatsBoard() {
  const [teamStats, setTeamStats] = useState<Record<string, FortniteStats | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalWins: 0,
    totalKills: 0,
    totalMatches: 0,
    averageKD: 0,
    averageWinRate: 0,
    totalScore: 0,
    validPlayers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getAllTeamStats();
        setTeamStats(stats);
        setTotals(calculateTeamTotals(stats));
      } catch (error) {
        console.error('Failed to load team stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="py-20 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fortnite-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-gaming font-bold mb-6">
            <span className="text-gradient">TEAM STATISTICS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time performance data showcasing our <span className="text-fortnite-blue font-bold">competitive dominance</span>
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {isLoading ? (
            <>
              <LoadingCard delay={0} />
              <LoadingCard delay={0.1} />
              <LoadingCard delay={0.2} />
              <LoadingCard delay={0.3} />
            </>
          ) : (
            <>
              <StatCard
                title="Total Wins"
                value={formatNumber(totals.totalWins)}
                subtitle="Across all game modes"
                color="neon-cyan"
                icon="🏆"
                delay={0}
              />

              <StatCard
                title="Team K/D Ratio"
                value={formatKD(totals.averageKD)}
                subtitle="Average across team"
                color="fortnite-yellow"
                icon="⚔️"
                delay={0.1}
              />

              <StatCard
                title="Win Rate"
                value={formatWinRate(totals.averageWinRate)}
                subtitle="Victory percentage"
                color="fortnite-orange"
                icon="📈"
                delay={0.2}
              />

              <StatCard
                title="Total Eliminations"
                value={formatNumber(totals.totalKills)}
                subtitle="Combined eliminations"
                color="neon-green"
                icon="💀"
                delay={0.3}
              />
            </>
          )}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            <>
              <LoadingCard delay={0.4} />
              <LoadingCard delay={0.5} />
              <LoadingCard delay={0.6} />
            </>
          ) : (
            <>
              <StatCard
                title="Total Matches"
                value={formatNumber(totals.totalMatches)}
                subtitle="Games played"
                color="fortnite-blue"
                delay={0.4}
              />

              <StatCard
                title="Total Score"
                value={formatNumber(totals.totalScore)}
                subtitle="Combined points"
                color="fortnite-purple"
                delay={0.5}
              />

              <StatCard
                title="Active Players"
                value={totals.validPlayers}
                subtitle="With tracked stats"
                color="neon-pink"
                delay={0.6}
              />
            </>
          )}
        </div>

        {/* Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="bg-gaming-gray/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gradient">
            Performance Highlights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-lg font-semibold text-white mb-1">Precision</div>
              <div className="text-sm text-gray-400">High accuracy eliminations</div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-lg font-semibold text-white mb-1">Speed</div>
              <div className="text-sm text-gray-400">Fast-paced gameplay</div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-lg font-semibold text-white mb-1">Strategy</div>
              <div className="text-sm text-gray-400">Tactical superiority</div>
            </div>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-gray-400">Real-time stats</span>
            </div>
            <div className="w-1 h-4 bg-gray-600" />
            <span className="text-gray-500">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
