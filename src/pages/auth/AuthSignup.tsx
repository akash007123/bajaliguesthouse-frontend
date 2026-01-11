import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  mobile: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface AuthSignupProps {
  isAdmin?: boolean;
}

const AuthSignup: React.FC<AuthSignupProps> = ({ isAdmin = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    const success = await signup(data.name, data.email, data.password, data.mobile, data.address, profilePicture || undefined, isAdmin ? 'admin' : 'user');

    if (success) {
      toast.success('Account created successfully!');
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card rounded-xl border border-border p-8 shadow-soft">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">Shri Balaji</span>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {isAdmin ? 'Admin Registration' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isAdmin ? 'Register as an administrator' : 'Join us for exclusive benefits'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} required />
              <FormInput label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Mobile" placeholder="+1234567890" error={errors.mobile?.message} {...register('mobile')} />
              <FormInput label="Address" placeholder="123 Main St, City, Country" error={errors.address?.message} {...register('address')} />
            </div>

            <div className="space-y-2">
              <label className="label-hotel">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                className="w-full p-2 border border-border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FormInput label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" error={errors.password?.message} {...register('password')} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FormInput label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} required />
            </div>

            <Button type="submit" variant="hotel" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to={isAdmin ? '/admin/login' : '/login'} className="text-gold hover:text-gold-dark font-medium">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const UserSignup = () => <AuthSignup isAdmin={false} />;
export const AdminSignup = () => <AuthSignup isAdmin={true} />;
