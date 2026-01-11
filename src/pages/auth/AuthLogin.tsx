import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthLoginProps {
  isAdmin?: boolean;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ isAdmin = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || (isAdmin ? '/admin/dashboard' : '/user/dashboard');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const loggedInUser = await login(data.email, data.password);
    if (loggedInUser) {
      // Check if role matches for admin login
      if (isAdmin && loggedInUser.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        logout();
        setIsLoading(false);
        return;
      }
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-xl border border-border p-8 shadow-soft">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">Azure Haven</span>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {isAdmin ? 'Admin Login' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to {isAdmin ? 'manage the hotel' : 'your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Email or Mobile"
              placeholder="Enter your email or mobile"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" variant="hotel" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to={isAdmin ? '/admin/signup' : '/signup'} className="text-gold hover:text-gold-dark font-medium">
              Sign up
            </Link>
          </div>

          {!isAdmin && (
            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
                Admin Login →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const UserLogin = () => <AuthLogin isAdmin={false} />;
export const AdminLogin = () => <AuthLogin isAdmin={true} />;
