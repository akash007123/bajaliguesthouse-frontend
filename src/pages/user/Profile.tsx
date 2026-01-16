import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Key,
  Save
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
        address: profile.address || ''
      }));
    }
  }, [profile]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('mobile', formData.mobile.trim());
      formDataToSend.append('address', formData.address.trim());
      
      if (formData.currentPassword) formDataToSend.append('currentPassword', formData.currentPassword);
      if (formData.newPassword) formDataToSend.append('newPassword', formData.newPassword);
      if (profilePictureFile) formDataToSend.append('profilePicture', profilePictureFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success('Profile updated successfully!');
        // Reset password fields
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setProfilePictureFile(null);
        setProfilePreview(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengths = [
      { score: 0, label: 'Very Weak', color: 'bg-rose-500' },
      { score: 1, label: 'Weak', color: 'bg-amber-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-emerald-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' }
    ];
    
    return strengths[Math.min(score, strengths.length - 1)];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (profileLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg">Manage your account information and preferences</p>
        </div>
        <Badge variant="outline" className="gap-2 px-3 py-2 text-sm">
          <Shield className="w-4 h-4" />
          Account Status: Active
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 sticky top-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    {profilePreview || profile?.profilePicture ? (
                      <img
                        src={profilePreview || (profile?.profilePicture ? (profile.profilePicture.startsWith('http') ? profile.profilePicture : `${import.meta.env.VITE_API_URL}/${profile.profilePicture}`) : undefined)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-picture" className="absolute bottom-2 right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* User Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{formData.name || 'Your Name'}</h2>
                  <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {formData.email}
                  </p>
                  <Badge variant="secondary" className="capitalize">
                    {user?.role || 'User'}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="w-full space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short' 
                      }) : 'N/A'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Never'}
                    </span>
                  </div>
                </div>

                {/* Upload Info */}
                {profilePictureFile && (
                  <div className="w-full p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
                    <p className="text-sm text-amber-500 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      New photo selected
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(profilePictureFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="border-b border-border/50">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="personal" className="gap-2">
                    <User className="w-4 h-4" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-6">
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <p className="text-muted-foreground mb-6">Update your personal details and contact information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter your mobile number"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your complete address"
                      className="min-h-24"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
                  <p className="text-muted-foreground mb-6">Update your password and security settings</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        placeholder="Enter your current password"
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Enter your new password"
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {formData.newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Password Strength:</span>
                          <span className={`font-medium ${
                            passwordStrength.label === 'Strong' || passwordStrength.label === 'Good' 
                              ? 'text-emerald-500' 
                              : passwordStrength.label === 'Fair'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ 
                              width: `${(passwordStrength.score + 1) * 20}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm your new password"
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {formData.newPassword && formData.confirmPassword && (
                      <div className={`flex items-center gap-2 text-sm ${
                        formData.newPassword === formData.confirmPassword 
                          ? 'text-emerald-500' 
                          : 'text-rose-500'
                      }`}>
                        {formData.newPassword === formData.confirmPassword ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span>
                          {formData.newPassword === formData.confirmPassword 
                            ? 'Passwords match' 
                            : 'Passwords do not match'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <Card className="border-border/50 bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold mb-2">Password Requirements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Contains uppercase and lowercase letters
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Includes at least one number
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Contains special characters
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;