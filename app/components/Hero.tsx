import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import { getAllTeamStats, calculateTeamTotals, formatNumber, formatKD, formatWinRate } from '~/utils/fortniteApi';

export default function Hero() {
  const [teamStats, setTeamStats] = useState({
    totalWins: 1247,
    averageKD: 2.8,
    averageWinRate: 23.4,
    averageScore: 5200,
    isLoading: true,
  });

  useEffect(() => {
    const loadQuickStats = async () => {
      try {
        const allStats = await getAllTeamStats();
        const totals = calculateTeamTotals(allStats);

        setTeamStats({
          totalWins: totals.totalWins,
          averageKD: totals.averageKD,
          averageWinRate: totals.averageWinRate,
          averageScore: Math.round(totals.totalScore / totals.validPlayers) || 0,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to load quick stats:', error);
        // Keep default values if API fails
        setTeamStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadQuickStats();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gaming-dark/20 via-transparent to-gaming-dark/80 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-gaming font-black mb-6">
            <span className="text-gradient">FTW</span>
          </h1>
          <div className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-white">FORTNITE </span>
            <span className="text-neon-cyan">E-SPORTS</span>
            <span className="text-white"> TEAM</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Dominating the <span className="text-fortnite-blue font-bold">wins leaderboards</span> with
            cutting-edge strategy, unmatched skill, and relentless competitive spirit.
          </p>
        </motion.div>



        {/* Floating Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="card-gaming text-center relative overflow-hidden group">
            <div className="text-4xl font-bold text-neon-cyan mb-2 relative z-10">
              {teamStats.isLoading ? (
                <div className="animate-pulse bg-gray-700 h-10 w-16 mx-auto rounded" />
              ) : (
                formatNumber(teamStats.totalWins)
              )}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wide font-medium">Total Wins</div>
            <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">🏆</div>
          </div>

          <div className="card-gaming text-center relative overflow-hidden group">
            <div className="text-4xl font-bold text-fortnite-yellow mb-2 relative z-10">
              {teamStats.isLoading ? (
                <div className="animate-pulse bg-gray-700 h-10 w-12 mx-auto rounded" />
              ) : (
                formatKD(teamStats.averageKD)
              )}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wide font-medium">Avg K/D</div>
            <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">⚔️</div>
          </div>

          <div className="card-gaming text-center relative overflow-hidden group">
            <div className="text-3xl font-bold text-fortnite-orange mb-2 relative z-10">
              {teamStats.isLoading ? (
                <div className="animate-pulse bg-gray-700 h-8 w-14 mx-auto rounded" />
              ) : (
                formatWinRate(teamStats.averageWinRate)
              )}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wide font-medium">Win Rate</div>
            <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">📈</div>
          </div>

          <div className="card-gaming text-center relative overflow-hidden group">
            <div className="text-3xl font-bold text-neon-green mb-2 relative z-10">
              {teamStats.isLoading ? (
                <div className="animate-pulse bg-gray-700 h-8 w-12 mx-auto rounded" />
              ) : (
                formatNumber(teamStats.averageScore)
              )}
            </div>
            <div className="text-sm text-gray-300 uppercase tracking-wide font-medium">Avg Score</div>
            <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">🎯</div>
          </div>
        </motion.div>
      </div>

      {/* Animated Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white text-center"
        >
          <div className="text-sm mb-3 font-medium">Scroll to explore</div>
          <div className="w-8 h-12 border-2 border-neon-cyan/80 rounded-full mx-auto relative glow-effect">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-4 bg-neon-cyan rounded-full absolute left-1/2 transform -translate-x-1/2 top-2 shadow-lg shadow-neon-cyan/50"
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-2 border-fortnite-blue/30 rounded-full"
        />
      </div>

      <div className="absolute bottom-20 right-10 z-10">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-neon-pink/30 rounded-full"
        />
      </div>

      <div className="absolute top-1/2 right-20 z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-gradient-neon rounded-full opacity-20"
        />
      </div>
    </section>
  );
}
