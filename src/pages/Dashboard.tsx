
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useMatch } from '@/context/MatchContext';
import NavBar from '@/components/NavBar';
import UserStatsCard from '@/components/UserStatsCard';
import MatchCard from '@/components/MatchCard';
import { 
  Gamepad2, 
  Wallet, 
  Trophy,
  Clock 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const { userMatches } = useMatch();
  
  // Filter recent matches (last 3)
  const recentMatches = [...userMatches]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pl-20">
      <NavBar />
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-gaming text-violet-300 mb-2">
            Welcome, {user.username}!
          </h1>
          <p className="text-slate-400">Let's get ready to battle!</p>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/match">
            <Card className="game-card hover:neon-border cursor-pointer transition-all h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">Find Matches</h3>
                <p className="text-sm text-slate-400">Join or create battles</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/wallet">
            <Card className="game-card hover:neon-border cursor-pointer transition-all h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">Wallet</h3>
                <p className="text-sm text-slate-400">Balance: ₹{user.walletBalance}</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/leaderboard">
            <Card className="game-card hover:neon-border cursor-pointer transition-all h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">Leaderboard</h3>
                <p className="text-sm text-slate-400">See top players</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="mb-8">
          <UserStatsCard user={user} />
        </div>
        
        {/* Recent Matches */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-gaming text-violet-300">
              Recent Matches
            </h2>
            <Link to="/match">
              <Button variant="ghost" className="text-violet-400 hover:text-violet-300 hover:bg-violet-950/50">
                View All
              </Button>
            </Link>
          </div>
          
          {recentMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <Card className="game-card p-6 text-center">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-slate-500 mb-2" />
                <p className="text-slate-400 mb-4">You haven't played any matches yet.</p>
                <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  <Link to="/match">Find a Match</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
