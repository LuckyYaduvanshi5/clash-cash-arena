
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
import { useUser } from '@/context/UserContext';
import NavBar from '@/components/NavBar';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowDownToLine, 
  CreditCard 
} from 'lucide-react';

const Wallet = () => {
  const { user, addFunds } = useUser();
  const [amount, setAmount] = useState<number>(100);
  const [isAdding, setIsAdding] = useState(false);
  
  // For the prototype, pre-defined amounts
  const quickAmounts = [100, 200, 500, 1000];
  
  const handleAddFunds = async () => {
    if (amount < 10) {
      return;
    }
    
    setIsAdding(true);
    try {
      addFunds(amount);
      // Reset amount to default
      setAmount(100);
    } finally {
      setIsAdding(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pl-20">
      <NavBar />
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-gaming text-violet-300 mb-2">
            Your Wallet
          </h1>
          <p className="text-slate-400">Manage your funds</p>
        </div>
        
        {/* Balance Card */}
        <Card className="game-card mb-8 bg-gradient-to-r from-violet-900/30 to-indigo-900/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <WalletIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-lg text-slate-300 mb-1">Current Balance</h2>
              <div className="text-4xl font-bold font-gaming text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 mb-2">
                ₹{user.walletBalance}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Add Funds Card */}
        <Card className="game-card mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-gaming text-violet-300">
              Add Funds
            </CardTitle>
            <CardDescription className="text-slate-400">
              Add money to your wallet to join matches
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 mb-6">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === amt ? "default" : "outline"}
                  className={`flex-1 min-w-[70px] ${
                    amount === amt 
                      ? "bg-gradient-to-r from-violet-600 to-purple-600" 
                      : "border-violet-500/30 text-violet-400 hover:bg-violet-950/50"
                  }`}
                  onClick={() => setAmount(amt)}
                >
                  ₹{amt}
                </Button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="mb-2 text-sm text-slate-400">Custom Amount (₹)</div>
                <Input
                  type="number"
                  min={10}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddFunds}
                  disabled={isAdding || amount < 10}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between bg-slate-800/30">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <CreditCard className="h-6 w-6 text-violet-400" />
                <div>
                  <div className="font-medium text-white">Demo Mode</div>
                  <div className="text-sm text-slate-400">
                    In the prototype, funds are added instantly
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-violet-500/30 text-violet-400 hover:bg-violet-950/50"
                disabled
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <Card className="game-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-gaming text-violet-300">
              Transaction History
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your recent transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center py-6 text-slate-400">
              Transaction history will be available in the full version.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Wallet;
