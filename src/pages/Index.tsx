
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Trophy, Gamepad2, CreditCard, Zap } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 flex flex-col items-center">
        <div className="absolute inset-0 bg-[url('/bg-hero.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="font-gaming text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">
            CLASH CASH ARENA
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Play. Win. Earn. Join skill-based gaming contests and win real money.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-8 py-6 text-lg">
                <Link to="/dashboard">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Enter Arena
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-8 py-6 text-lg">
                  <Link to="/login">
                    <Zap className="mr-2 h-5 w-5" />
                    Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-950/50 px-8 py-6 text-lg">
                  <Link to="/register">
                    Register Now
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-gaming text-center mb-12 text-violet-400">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="game-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Join a Contest</h3>
              <p className="text-slate-400">Pay a small entry fee to join a 1v1 or team contest.</p>
            </div>
            
            <div className="game-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Win Your Match</h3>
              <p className="text-slate-400">Battle it out in a fair, skill-based competition.</p>
            </div>
            
            <div className="game-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Claim Your Prize</h3>
              <p className="text-slate-400">Winner gets the prize money instantly in their wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-900/30 to-purple-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-gaming mb-4 text-white">Ready to Play?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join now and get 100 coins bonus to start your gaming journey!
          </p>
          
          {isAuthenticated ? (
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-8 py-6 text-lg">
              <Link to="/dashboard">
                Enter Arena
              </Link>
            </Button>
          ) : (
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-8 py-6 text-lg">
              <Link to="/register">
                Register Now
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/80">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Clash Cash Arena. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
