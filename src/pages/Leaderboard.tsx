
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import NavBar from '@/components/NavBar';
import { Trophy, Medal, User as UserIcon } from 'lucide-react';
import { User } from '@/context/UserContext';

const Leaderboard = () => {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Sort users by win rate and total wins
    const sortedUsers = users
      .map((u: any) => {
        const { password, ...userWithoutPassword } = u;
        const winRate = u.totalMatches > 0 ? (u.wins / u.totalMatches) * 100 : 0;
        return { ...userWithoutPassword, winRate };
      })
      .sort((a: User, b: User) => {
        // First compare by wins
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }
        // If wins are equal, compare by win rate
        const aWinRate = a.totalMatches > 0 ? (a.wins / a.totalMatches) * 100 : 0;
        const bWinRate = b.totalMatches > 0 ? (b.wins / b.totalMatches) * 100 : 0;
        return bWinRate - aWinRate;
      });
    
    setLeaderboard(sortedUsers);
    
    // Find current user's rank
    if (user) {
      const rank = sortedUsers.findIndex((u: User) => u.id === user.id);
      setUserRank(rank !== -1 ? rank + 1 : null);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pl-20">
      <NavBar />
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-gaming text-violet-300 mb-2">
            Leaderboard
          </h1>
          <p className="text-slate-400">Top players ranked by wins and performance</p>
        </div>
        
        {/* User's Rank Card */}
        {userRank && (
          <Card className="game-card mb-8 p-6 bg-gradient-to-r from-violet-900/30 to-indigo-900/30">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-16 h-16 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.username} 
                      className="w-14 h-14 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-violet-300" />
                  )}
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">{user.username}</div>
                  <div className="text-sm text-slate-400">
                    {user.wins} wins • {user.totalMatches} matches
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-900/30 border border-yellow-500/30 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Your Rank</div>
                  <div className="text-2xl font-bold text-white">#{userRank}</div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Leaderboard */}
        <Card className="game-card overflow-hidden">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-gaming text-violet-300">
              Top Players
            </h2>
          </div>
          
          <div className="divide-y divide-slate-800">
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => {
                // Determine medal for top 3
                let medal = null;
                if (index === 0) medal = <Medal className="h-5 w-5 text-yellow-500" />;
                else if (index === 1) medal = <Medal className="h-5 w-5 text-slate-400" />;
                else if (index === 2) medal = <Medal className="h-5 w-5 text-amber-700" />;
                
                // Calculate win rate
                const winRate = player.totalMatches > 0 
                  ? Math.round((player.wins / player.totalMatches) * 100) 
                  : 0;
                
                return (
                  <div 
                    key={player.id} 
                    className={`p-4 flex items-center ${
                      player.id === user.id ? 'bg-violet-900/20' : ''
                    }`}
                  >
                    <div className="w-8 flex items-center justify-center mr-4">
                      {medal || <span className="text-slate-500">#{index + 1}</span>}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center mr-4">
                      {player.avatarUrl ? (
                        <img 
                          src={player.avatarUrl} 
                          alt={player.username} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-violet-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white font-medium">{player.username}</div>
                      <div className="text-xs text-slate-400">
                        {player.wins} wins • {player.totalMatches} matches
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Win Rate</div>
                      <div className="text-lg font-bold text-white">{winRate}%</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400">
                No players found. Be the first to compete!
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
