
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUser } from './UserContext';

export interface Match {
  id: string;
  entryFee: number;
  player1Id: string;
  player1Name: string;
  player1Avatar: string;
  player2Id: string | null;
  player2Name: string | null;
  player2Avatar: string | null;
  status: 'open' | 'in-progress' | 'completed' | 'disputed';
  winner: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MatchContextType {
  availableMatches: Match[];
  userMatches: Match[];
  createMatch: (entryFee: number) => Promise<Match | null>;
  joinMatch: (matchId: string) => Promise<boolean>;
  submitResult: (matchId: string, winnerId: string) => Promise<boolean>;
  getMatchById: (matchId: string) => Match | undefined;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, deductFunds, addFunds, updateUserStats } = useUser();
  const [availableMatches, setAvailableMatches] = useState<Match[]>([]);
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  
  // Load matches from localStorage on initial render
  useEffect(() => {
    const storedMatches = localStorage.getItem('matches');
    if (storedMatches) {
      const allMatches = JSON.parse(storedMatches);
      
      // Filter available matches (open and not created by current user)
      if (user) {
        setAvailableMatches(
          allMatches.filter((match: Match) => 
            match.status === 'open' && match.player1Id !== user.id
          )
        );
        
        // Filter user's matches
        setUserMatches(
          allMatches.filter((match: Match) => 
            match.player1Id === user.id || match.player2Id === user.id
          )
        );
      } else {
        setAvailableMatches([]);
        setUserMatches([]);
      }
    }
  }, [user]);

  // Save matches to localStorage whenever they change
  useEffect(() => {
    const allMatches = [...availableMatches, ...userMatches.filter(um => 
      !availableMatches.some(am => am.id === um.id)
    )];
    
    if (allMatches.length > 0) {
      localStorage.setItem('matches', JSON.stringify(allMatches));
    }
  }, [availableMatches, userMatches]);

  const createMatch = async (entryFee: number): Promise<Match | null> => {
    if (!user) return null;
    
    // Check if user has enough funds
    if (!deductFunds(entryFee)) {
      return null;
    }
    
    // Create new match
    const newMatch: Match = {
      id: Date.now().toString(),
      entryFee,
      player1Id: user.id,
      player1Name: user.username,
      player1Avatar: user.avatarUrl,
      player2Id: null,
      player2Name: null,
      player2Avatar: null,
      status: 'open',
      winner: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update state
    setUserMatches(prev => [...prev, newMatch]);
    
    // Save to localStorage
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    localStorage.setItem('matches', JSON.stringify([...storedMatches, newMatch]));
    
    toast({
      title: "Match created!",
      description: `Your ₹${entryFee} match is now open for others to join`,
      variant: "default",
    });
    
    return newMatch;
  };

  const joinMatch = async (matchId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Find match
    const allMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const matchIndex = allMatches.findIndex((m: Match) => m.id === matchId);
    
    if (matchIndex === -1) {
      toast({
        title: "Match not found",
        description: "This match no longer exists",
        variant: "destructive",
      });
      return false;
    }
    
    const match = allMatches[matchIndex];
    
    // Check if match is already full
    if (match.player2Id) {
      toast({
        title: "Match full",
        description: "Someone else already joined this match",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if user has enough funds
    if (!deductFunds(match.entryFee)) {
      return false;
    }
    
    // Update match
    match.player2Id = user.id;
    match.player2Name = user.username;
    match.player2Avatar = user.avatarUrl;
    match.status = 'in-progress';
    match.updatedAt = new Date().toISOString();
    
    // Update stored matches
    allMatches[matchIndex] = match;
    localStorage.setItem('matches', JSON.stringify(allMatches));
    
    // Update state
    setAvailableMatches(prev => prev.filter(m => m.id !== matchId));
    setUserMatches(prev => [...prev, match]);
    
    toast({
      title: "Match joined!",
      description: `You joined a ₹${match.entryFee} match against ${match.player1Name}`,
      variant: "default",
    });
    
    return true;
  };

  const submitResult = async (matchId: string, winnerId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Find match
    const allMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const matchIndex = allMatches.findIndex((m: Match) => m.id === matchId);
    
    if (matchIndex === -1) {
      toast({
        title: "Match not found",
        description: "This match no longer exists",
        variant: "destructive",
      });
      return false;
    }
    
    const match = allMatches[matchIndex];
    
    // Check if match is in progress
    if (match.status !== 'in-progress') {
      toast({
        title: "Invalid match",
        description: "This match is not in progress",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if user is part of the match
    if (match.player1Id !== user.id && match.player2Id !== user.id) {
      toast({
        title: "Not your match",
        description: "You are not part of this match",
        variant: "destructive",
      });
      return false;
    }
    
    // Update match
    match.status = 'completed';
    match.winner = winnerId;
    match.updatedAt = new Date().toISOString();
    
    // Update stored matches
    allMatches[matchIndex] = match;
    localStorage.setItem('matches', JSON.stringify(allMatches));
    
    // Update user matches
    setUserMatches(prev => prev.map(m => m.id === matchId ? match : m));
    
    // Handle prize distribution
    const prizeAmount = match.entryFee * 2 * 0.8; // 80% of pool (20% platform fee)
    
    if (winnerId === user.id) {
      // Current user won
      addFunds(prizeAmount);
      updateUserStats(true);
      
      toast({
        title: "Victory!",
        description: `You won ₹${prizeAmount}!`,
        variant: "default",
      });
    } else {
      // Current user lost
      updateUserStats(false);
      
      toast({
        title: "Defeat",
        description: "Better luck next time!",
        variant: "destructive",
      });
    }
    
    return true;
  };

  const getMatchById = (matchId: string): Match | undefined => {
    const allMatches = [...availableMatches, ...userMatches];
    return allMatches.find(m => m.id === matchId);
  };

  return (
    <MatchContext.Provider value={{
      availableMatches,
      userMatches,
      createMatch,
      joinMatch,
      submitResult,
      getMatchById
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
