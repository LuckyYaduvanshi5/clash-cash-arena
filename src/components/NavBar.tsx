
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/UserContext';
import { 
  Home,
  Gamepad2,
  Wallet,
  Trophy,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react';

const NavBar = () => {
  const { user, logout, isAdmin } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/dashboard' },
    { name: 'Matches', icon: <Gamepad2 className="h-5 w-5" />, href: '/match' },
    { name: 'Wallet', icon: <Wallet className="h-5 w-5" />, href: '/wallet' },
    { name: 'Leaderboard', icon: <Trophy className="h-5 w-5" />, href: '/leaderboard' },
  ];

  // Admin only nav item
  if (isAdmin()) {
    navItems.push({ 
      name: 'Admin', 
      icon: <ShieldCheck className="h-5 w-5" />, 
      href: '/admin' 
    });
  }

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center p-3 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700">
        {navItems.slice(0, 4).map(item => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all ${
              isActive(item.href) ? 'text-violet-400 bg-violet-900/20' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-slate-400">
              <Menu className="h-5 w-5" />
              <span className="text-xs mt-1">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-80 game-card border-slate-700">
            <div className="flex flex-col h-full pt-4">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                      isActive(item.href) 
                        ? 'text-violet-400 bg-violet-900/20' 
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span className="text-xs mt-2">{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-auto border-t border-slate-700 pt-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-slate-400">₹{user.walletBalance}</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Side Nav */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-20 z-50 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700">
        <div className="flex flex-col items-center h-full py-8">
          <h1 className="font-gaming text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600 mb-8">
            CCA
          </h1>
          
          <div className="flex flex-col space-y-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all ${
                  isActive(item.href) ? 'text-violet-400 bg-violet-900/20' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-12 w-12">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 game-card border-slate-700">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm text-white">{user.username}</p>
                    <p className="w-[200px] truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center"
                  onClick={() => navigate('/wallet')}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Balance: ₹{user.walletBalance}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
