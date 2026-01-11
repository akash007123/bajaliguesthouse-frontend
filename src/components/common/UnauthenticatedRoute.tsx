import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
}

export const UnauthenticatedRoute: React.FC<UnauthenticatedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard
    const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};