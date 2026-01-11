import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/forms/FormInput';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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

  const { data: profile } = useQuery({
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

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('address', formData.address);
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
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Profile Settings</h1>
      <div className="bg-card rounded-xl border border-border p-8 max-w-2xl">
        {profile?.profilePicture && (
          <div className="mb-6 flex justify-center">
            <img
              src={profile.profilePicture}
              alt="Current Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-border"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormInput
            label="Mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          <FormInput
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <FormInput
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          <FormInput
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-border rounded-md"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button variant="hotel" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
