import type { MetaFunction } from "@remix-run/node";
import Navigation from "~/components/Navigation";
import Hero from "~/components/Hero";
import TeamMembers from "~/components/TeamMembers";
import StatsBoard from "~/components/StatsBoard";

export const meta: MetaFunction = () => {
  return [
    { title: "FTW Anti-Grinders Team | Elite Fortnite E-Sports Squad" },
    {
      name: "description",
      content: "FTW Anti-Grinders Team - We don't grind, we dominate. Elite Fortnite competitive gaming squad with strategic gameplay and unmatched skill."
    },
    { name: "keywords", content: "Fortnite, e-sports, gaming, competitive, FTW, anti-grinders, team, elite, dominate" },
    { property: "og:title", content: "FTW Anti-Grinders Team" },
    { property: "og:description", content: "Elite Fortnite e-sports team - We don't grind, we dominate the competitive scene" },
    { property: "og:type", content: "website" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gaming-dark text-white overflow-x-hidden">
      <Navigation />

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="team">
          <TeamMembers />
        </section>

        <section id="stats">
          <StatsBoard />
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-gaming font-bold mb-8">
              <span className="text-gradient">ABOUT FTW ANTI-GRINDERS</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              We are <span className="text-fortnite-blue font-bold">FTW Anti-Grinders Team</span> -
              the paradox that dominates Fortnite. While others grind endlessly,
              <span className="text-cyan-400 font-bold"> we achieve more with pure skill and strategy</span>.
              We don't need to grind because we're already at the top.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Our philosophy is simple: <span className="text-fortnite-purple font-semibold">Quality over quantity</span>.
              Every match is calculated, every move is precise, every victory is earned through
              superior gameplay—not mindless repetition.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              We are the <span className="text-gradient font-bold">anti-grinders who out-grind the grinders</span>.
              That's the FTW difference.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gaming-gray/50 border-t border-gray-800 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center">
                    <span className="text-white font-gaming font-bold text-lg">F</span>
                  </div>
                  <span className="text-2xl font-gaming font-bold text-gradient">FTW</span>
                </div>
                <p className="text-gray-400">
                  FTW Anti-Grinders Team - We don't grind, we dominate. Elite Fortnite
                  e-sports squad with unmatched skill and strategy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#team" className="text-gray-400 hover:text-white transition-colors">Team</a></li>
                  <li><a href="#stats" className="text-gray-400 hover:text-white transition-colors">Statistics</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
                <p className="text-gray-400 mb-4">
                  Follow our anti-grind philosophy to elite domination
                </p>
                <div className="flex space-x-4">
                  <button className="w-10 h-10 bg-gray-700 hover:bg-fortnite-blue rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-white">📺</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-700 hover:bg-fortnite-blue rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-white">🎮</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-700 hover:bg-fortnite-blue rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-white">💬</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-500">
                © 2024 FTW Anti-Grinders Team. All rights reserved. | Powered by elite domination, not grinding.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
