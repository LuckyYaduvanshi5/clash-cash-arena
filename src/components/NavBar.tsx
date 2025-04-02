
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import {
  Trophy,
  Home,
  Wallet,
  Gamepad2,
  LogOut,
  Menu,
  X,
  UserCircle
} from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/match', label: 'Battle', icon: <Gamepad2 className="h-5 w-5" /> },
    { path: '/wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile navigation */}
      <div className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-violet-900/30 md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-violet-500 glow-text">CASH<span className="text-white">ARENA</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-violet-300">₹{user.walletBalance}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-white"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {menuOpen && (
          <div className="bg-black/90 pt-2 pb-6 px-4 backdrop-blur-md border-b border-violet-900/30 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-violet-900/50 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors text-red-400 hover:bg-red-950/50 hover:text-red-300 justify-start"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop navigation */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-20 flex-col border-r border-violet-900/30 bg-black/80 backdrop-blur-md md:flex">
        <div className="flex h-20 items-center justify-center border-b border-violet-900/30">
          <Link to="/dashboard" className="text-violet-500 font-bold glow-text">
            CA
          </Link>
        </div>
        
        <div className="flex flex-col items-center justify-between flex-1 py-6">
          <div className="flex flex-col items-center space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-violet-900/50 text-white neon-border'
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-white'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            {user && (
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-white" />
                </div>
                <span className="text-xs font-medium text-violet-300">₹{user.walletBalance}</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-12 w-12 rounded-lg text-red-400 hover:bg-red-950/50 hover:text-red-300"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
