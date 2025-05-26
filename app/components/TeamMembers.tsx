import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getPlayerStats, getAllTeamStats, FortniteStats, formatNumber, formatKD, formatWinRate } from '~/utils/fortniteApi';
import PlayerDetailPage from './PlayerDetailPage';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  stats?: FortniteStats | null;
  isLoading?: boolean;
}

const TEAM_DATA: Omit<TeamMember, 'stats' | 'isLoading'>[] = [
  {
    name: 'RootByte',
    role: 'IGL',
    description: 'Strategic mastermind and in-game leader with exceptional game sense and tactical coordination.',
  },
  {
    name: 'neto-_FTW',
    role: 'Assault Specialist',
    description: 'Aggressive playstyle with incredible aim and clutch potential in high-pressure situations.',
  },
  {
    name: 'Intercêptor',
    role: 'Support Player',
    description: 'Master of positioning and team coordination, ensuring optimal team rotations.',
  },
  {
    name: 'FTW_SAITAMA',
    role: 'Entry Fragger',
    description: 'First into battle with lightning-fast reflexes and devastating elimination power.',
  },
  {
    name: 'Rey Bjorn FTW',
    role: 'Sniper',
    description: 'Long-range specialist with pinpoint accuracy and exceptional map awareness.',
  },
  {
    name: 'ValkyFTW',
    role: 'Flex Player',
    description: 'Versatile player adapting to any role needed, bringing consistency and reliability.',
  },
];

function PlayerCard({ member, index, onPlayerClick }: {
  member: TeamMember;
  index: number;
  onPlayerClick: (member: TeamMember) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onPlayerClick(member)}
      whileHover={{ y: -5, scale: 1.02 }}
      className="card-gaming relative overflow-hidden group cursor-pointer"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-fortnite-blue/10 to-fortnite-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-fortnite-blue font-semibold text-sm uppercase tracking-wide">
                {member.role}
              </p>
              <div className="w-2 h-2 bg-fortnite-blue rounded-full" />
              <span className="text-xs text-neon-cyan font-medium">PRO</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50" />
              <span className="text-xs text-gray-300 font-medium">Online</span>
            </div>
            <div className="text-xs text-yellow-400 font-semibold">⚡ ACTIVE</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          {member.description}
        </p>

        {/* Stats */}
        {member.isLoading ? (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-4 h-4 bg-neon-cyan rounded-full animate-ping" />
                <span className="text-sm text-neon-cyan font-medium">Loading stats...</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : member.stats?.stats?.all?.overall ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan">
                {formatNumber(member.stats.stats.all.overall.wins)}
              </div>
              <div className="text-xs text-gray-400 uppercase">Wins</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-fortnite-yellow">
                {formatKD(member.stats.stats.all.overall.kd)}
              </div>
              <div className="text-xs text-gray-400 uppercase">K/D</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-fortnite-orange">
                {formatWinRate(member.stats.stats.all.overall.winRate)}
              </div>
              <div className="text-xs text-gray-400 uppercase">Win Rate</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">
                {formatNumber(member.stats.stats.all.overall.kills)}
              </div>
              <div className="text-xs text-gray-400 uppercase">Kills</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <div className="text-sm flex items-center justify-center space-x-2">
              <span>🔒</span>
              <span>Stats unavailable</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Player profile may be private</div>
          </div>
        )}



        {/* Hover Effect */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-gaming origin-left"
        />
      </div>
    </motion.div>
  );
}

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    TEAM_DATA.map(member => ({ ...member, isLoading: true }))
  );
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMember | null>(null);

  useEffect(() => {
    const loadTeamStats = async () => {
      try {
        // Use the optimized function that handles 3 requests per second
        const allStats = await getAllTeamStats();

        // Update all team members at once
        const updatedMembers = TEAM_DATA.map(member => ({
          ...member,
          stats: allStats[member.name] || null,
          isLoading: false,
        }));

        // Sort members by wins (highest first) - Shows team ranking by performance
        const sortedMembers = updatedMembers.sort((a, b) => {
          const aWins = a.stats?.stats?.all?.overall?.wins || 0;
          const bWins = b.stats?.stats?.all?.overall?.wins || 0;
          return bWins - aWins; // Descending order (highest wins first)
        });

        setTeamMembers(sortedMembers);
      } catch (error) {
        console.error('Failed to load team stats:', error);

        // Set all members to not loading with null stats
        const updatedMembers = TEAM_DATA.map(member => ({
          ...member,
          stats: null,
          isLoading: false,
        }));

        // Keep original order when stats fail to load
        setTeamMembers(updatedMembers);
      }
    };

    loadTeamStats();
  }, []);

  const handlePlayerClick = (member: TeamMember) => {
    setSelectedPlayer(member);
  };

  const handleBackToTeam = () => {
    setSelectedPlayer(null);
  };

  // If a player is selected, show their individual page
  if (selectedPlayer) {
    return <PlayerDetailPage player={selectedPlayer} onBack={handleBackToTeam} />;
  }

  return (
    <section className="py-20 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-fortnite-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fortnite-purple/5 rounded-full blur-3xl" />
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
            <span className="text-gradient">MEET THE TEAM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Six elite players united by one goal: <span className="text-fortnite-blue font-bold">dominating Fortnite</span>
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <PlayerCard
              key={member.name}
              member={member}
              index={index}
              onPlayerClick={handlePlayerClick}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
