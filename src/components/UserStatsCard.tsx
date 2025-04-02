
import { User } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, BarChart } from 'lucide-react';

interface UserStatsCardProps {
  user: User;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
  // Calculate win rate
  const winRate = user.totalMatches > 0 
    ? Math.round((user.wins / user.totalMatches) * 100) 
    : 0;

  return (
    <Card className="game-card overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-gaming text-violet-300">
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-around gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mb-1 border border-green-500/30">
              <Trophy className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm text-slate-400">Wins</span>
            <span className="text-lg font-bold text-white">{user.wins}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-1 border border-blue-500/30">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm text-slate-400">Matches</span>
            <span className="text-lg font-bold text-white">{user.totalMatches}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-900/30 flex items-center justify-center mb-1 border border-yellow-500/30">
              <BarChart className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="text-sm text-slate-400">Win Rate</span>
            <span className="text-lg font-bold text-white">{winRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
