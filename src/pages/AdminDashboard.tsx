
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, useUser } from '@/context/UserContext';
import NavBar from '@/components/NavBar';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  TrendingUp,
  Gamepad2,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';

interface DisputedMatch {
  id: string;
  player1: string;
  player2: string;
  entryFee: number;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  username: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [platform, setPlatform] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalRevenue: 0,
    pendingDisputes: 0,
    pendingWithdrawals: 0,
  });
  const [disputedMatches, setDisputedMatches] = useState<DisputedMatch[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Check if user is an admin
    if (!isAdmin()) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    // Load users from localStorage
    const loadedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(loadedUsers.map((u: any) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    }));

    // Calculate platform stats
    setPlatform({
      totalUsers: loadedUsers.length,
      totalMatches: loadedUsers.reduce((acc: number, u: any) => acc + u.totalMatches, 0),
      totalRevenue: Math.floor(Math.random() * 10000), // Simulated revenue
      pendingDisputes: Math.floor(Math.random() * 5), // Simulated disputes
      pendingWithdrawals: Math.floor(Math.random() * 10), // Simulated withdrawals
    });

    // Create demo disputed matches
    const demoDisputes: DisputedMatch[] = [
      {
        id: '1',
        player1: 'user',
        player2: 'player123',
        entryFee: 50,
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        player1: 'gamer456',
        player2: 'user',
        entryFee: 100,
        status: 'pending',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setDisputedMatches(demoDisputes);

    // Create demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: '1',
        userId: '1',
        username: 'user',
        amount: 500,
        type: 'deposit',
        status: 'completed',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: '1',
        username: 'user',
        amount: 200,
        type: 'withdrawal',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId: '3',
        username: 'player123',
        amount: 1000,
        type: 'deposit',
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        userId: '4',
        username: 'gamer456',
        amount: 300,
        type: 'withdrawal',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setTransactions(demoTransactions);
  }, [isAdmin, navigate]);

  const approveWithdrawal = (id: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status: 'completed' } : t
    ));
    toast({
      title: "Withdrawal approved",
      description: "The withdrawal request has been approved",
      variant: "default",
    });
  };

  const resolveDispute = (id: string, winner: string) => {
    setDisputedMatches(disputedMatches.map(d => 
      d.id === id ? { ...d, status: 'resolved' } : d
    ));
    toast({
      title: "Dispute resolved",
      description: `${winner} has been declared the winner`,
      variant: "default",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pl-20">
      <NavBar />
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-gaming text-violet-300 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Manage your gaming platform</p>
        </div>
        
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="game-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-violet-400 mr-2" />
                <span className="text-2xl font-bold text-white">{platform.totalUsers}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="game-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Gamepad2 className="h-5 w-5 text-violet-400 mr-2" />
                <span className="text-2xl font-bold text-white">{platform.totalMatches}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="game-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-emerald-400 mr-2" />
                <span className="text-2xl font-bold text-white">₹{platform.totalRevenue}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="game-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-white">{platform.pendingDisputes}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="game-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-white">{platform.pendingWithdrawals}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8 bg-slate-800/50">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="disputes">Match Disputes</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="game-card">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Wallet Balance</TableHead>
                      <TableHead>Total Matches</TableHead>
                      <TableHead>Win/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>₹{user.walletBalance}</TableCell>
                        <TableCell>{user.totalMatches}</TableCell>
                        <TableCell>{user.wins}/{user.losses}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="disputes">
            <Card className="game-card">
              <CardHeader>
                <CardTitle>Match Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {disputedMatches.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match ID</TableHead>
                        <TableHead>Player 1</TableHead>
                        <TableHead>Player 2</TableHead>
                        <TableHead>Entry Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputedMatches.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell>{dispute.id}</TableCell>
                          <TableCell>{dispute.player1}</TableCell>
                          <TableCell>{dispute.player2}</TableCell>
                          <TableCell>₹{dispute.entryFee}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              dispute.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {dispute.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {dispute.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => resolveDispute(dispute.id, dispute.player1)}
                                >
                                  P1 Wins
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => resolveDispute(dispute.id, dispute.player2)}
                                >
                                  P2 Wins
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-slate-400 py-8">No disputed matches found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card className="game-card">
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.username}</TableCell>
                        <TableCell>₹{transaction.amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => approveWithdrawal(transaction.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
