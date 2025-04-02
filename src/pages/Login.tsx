
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Check if there are any users in localStorage, if not create demo users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      // Create demo user and admin accounts
      const demoUsers = [
        {
          id: '1',
          username: 'user',
          email: 'user@example.com',
          password: 'password',
          walletBalance: 100,
          totalMatches: 5,
          wins: 3,
          losses: 2,
          avatarUrl: `/avatars/avatar1.png`,
          role: 'user'
        },
        {
          id: '2',
          username: 'admin',
          email: 'admin@example.com',
          password: 'password',
          walletBalance: 1000,
          totalMatches: 10,
          wins: 8,
          losses: 2,
          avatarUrl: `/avatars/avatar2.png`,
          role: 'admin'
        }
      ];
      
      localStorage.setItem('users', JSON.stringify(demoUsers));
      
      toast({
        title: "Demo accounts created",
        description: "User: user@example.com / Password: password\nAdmin: admin@example.com / Password: password",
        duration: 5000,
      });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = () => {
    form.setValue('email', 'user@example.com');
    form.setValue('password', 'password');
  };

  const fillDemoAdmin = () => {
    form.setValue('email', 'admin@example.com');
    form.setValue('password', 'password');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-gaming text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">
            CLASH CASH ARENA
          </h1>
          <p className="text-slate-400">Login to your account</p>
        </div>
        
        <div className="game-card p-6 rounded-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your@email.com"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="flex justify-between pt-2 text-sm">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-violet-300 p-0 h-auto"
                  onClick={fillDemoUser}
                >
                  Demo User
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-violet-300 p-0 h-auto"
                  onClick={fillDemoAdmin}
                >
                  Demo Admin
                </Button>
              </div>
              
              <div className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-violet-400 hover:text-violet-300">
                  Register
                </Link>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
