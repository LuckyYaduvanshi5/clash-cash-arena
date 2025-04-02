
import React from 'react';
import { Match } from '@/context/MatchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/context/UserContext';

interface MatchCardProps {
  match: Match;
  onJoin?: (matchId: string) => void;
  onSubmitWin?: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onJoin, onSubmitWin }) => {
  const { user } = useUser();

  if (!user) return null;

  const isPlayer1 = user.id === match.player1Id;
  const isPlayer2 = user.id === match.player2Id;
  const isParticipant = isPlayer1 || isPlayer2;
  
  // Format time since creation
  const timeAgo = formatDistanceToNow(new Date(match.createdAt), { addSuffix: true });
  
  // Calculate prize pool and winner amount
  const prizePool = match.entryFee * 2;
  const winnerAmount = prizePool * 0.8; // 80% to winner, 20% platform fee
  
  // Determine status color and icon
  let statusColor = 'bg-blue-500';
  let statusIcon = <Clock className="h-4 w-4" />;
  
  if (match.status === 'open') {
    statusColor = 'bg-green-500';
    statusIcon = <Gamepad2 className="h-4 w-4" />;
  } else if (match.status === 'completed') {
    statusColor = 'bg-purple-500';
    statusIcon = <Trophy className="h-4 w-4" />;
  } else if (match.status === 'disputed') {
    statusColor = 'bg-red-500';
    statusIcon = <AlertTriangle className="h-4 w-4" />;
  }

  return (
    <Card className="game-card overflow-hidden transform transition-all duration-300 h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
            <CardTitle className="text-lg font-gaming text-violet-300">
              ₹{match.entryFee} Match
            </CardTitle>
          </div>
          <div className="text-xs text-slate-400">{timeAgo}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center mb-1">
              {match.player1Avatar ? (
                <img 
                  src={match.player1Avatar} 
                  alt={match.player1Name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-xl">P1</span>
              )}
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[70px]">
              {match.player1Name}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-yellow-500 mb-1">VS</div>
            <div className="text-xs text-white bg-violet-800/50 rounded-full px-2 py-0.5">
              ₹{winnerAmount}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center mb-1">
              {match.player2Avatar ? (
                <img 
                  src={match.player2Avatar} 
                  alt={match.player2Name || 'Waiting'} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-sm text-slate-400">Waiting</span>
              )}
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[70px]">
              {match.player2Name || '...'}
            </span>
          </div>
        </div>
        
        {match.status === 'open' && !isParticipant && onJoin && (
          <Button 
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            onClick={() => onJoin(match.id)}
          >
            Join Match
          </Button>
        )}
        
        {match.status === 'in-progress' && isParticipant && onSubmitWin && (
          <Button 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={() => onSubmitWin(match.id)}
          >
            Submit Win
          </Button>
        )}
        
        {match.status === 'completed' && (
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-lg p-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-white">
              Winner: {match.winner === match.player1Id ? match.player1Name : match.player2Name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
