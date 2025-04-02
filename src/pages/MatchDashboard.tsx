
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { useMatch } from '@/context/MatchContext';
import NavBar from '@/components/NavBar';
import MatchCard from '@/components/MatchCard';
import { 
  Plus, 
  Search, 
  Gamepad2, 
  History, 
  InfoIcon 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MatchDashboard = () => {
  const { user } = useUser();
  const { availableMatches, userMatches, createMatch, joinMatch, submitResult } = useMatch();
  const { toast } = useToast();
  const [entryFee, setEntryFee] = useState<number>(10);
  const [isCreating, setIsCreating] = useState(false);
  
  // Filter active and completed matches
  const activeMatches = userMatches.filter(m => m.status === 'in-progress');
  const completedMatches = userMatches.filter(m => m.status === 'completed');
  
  const handleCreateMatch = async () => {
    if (entryFee < 10) {
      toast({
        title: "Invalid Entry Fee",
        description: "Minimum entry fee is ₹10",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    try {
      await createMatch(entryFee);
      // Reset entry fee to default
      setEntryFee(10);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleJoinMatch = async (matchId: string) => {
    await joinMatch(matchId);
  };
  
  const handleSubmitWin = async (matchId: string) => {
    if (!user) return;
    await submitResult(matchId, user.id);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pl-20">
      <NavBar />
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-gaming text-violet-300 mb-2">
            Match Center
          </h1>
          <p className="text-slate-400">Create or join matches and track your battles</p>
        </div>
        
        {/* Create Match Card */}
        <Card className="game-card mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-gaming text-violet-300">
              Create a New Match
            </CardTitle>
            <CardDescription className="text-slate-400">
              Set your entry fee and wait for an opponent
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="mb-2 text-sm text-slate-400">Entry Fee (₹)</div>
                <Input
                  type="number"
                  min={10}
                  value={entryFee}
                  onChange={(e) => setEntryFee(parseInt(e.target.value) || 10)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div>
                <div className="mb-2 text-sm text-slate-400">Your Balance</div>
                <div className="h-10 bg-slate-800/50 flex items-center px-3 rounded-md text-green-400 font-medium">
                  ₹{user.walletBalance}
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleCreateMatch}
                  disabled={isCreating || user.walletBalance < entryFee}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Match
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <InfoIcon className="h-4 w-4" />
              <span>Winner gets 80% of the total prize pool (entry fee × 2)</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Matches Tabs */}
        <Tabs defaultValue="available" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="available" className="data-[state=active]:bg-violet-900/50 data-[state=active]:text-white">
              <Search className="mr-2 h-4 w-4" />
              Available Matches
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-violet-900/50 data-[state=active]:text-white">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Your Active Matches
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-violet-900/50 data-[state=active]:text-white">
              <History className="mr-2 h-4 w-4" />
              Match History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-4">
            {availableMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onJoin={handleJoinMatch} 
                  />
                ))}
              </div>
            ) : (
              <Card className="game-card p-6 text-center">
                <p className="text-slate-400 mb-4">No matches available at the moment.</p>
                <Button onClick={handleCreateMatch} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create a Match
                </Button>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            {activeMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onSubmitWin={handleSubmitWin} 
                  />
                ))}
              </div>
            ) : (
              <Card className="game-card p-6 text-center">
                <p className="text-slate-400">You don't have any active matches.</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            {completedMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {completedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <Card className="game-card p-6 text-center">
                <p className="text-slate-400">You haven't completed any matches yet.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MatchDashboard;
