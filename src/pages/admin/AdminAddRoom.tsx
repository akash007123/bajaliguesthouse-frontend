import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const AdminAddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Deluxe' as Room['type'],
    price: 0,
    discountPrice: 0,
    shortDescription: '',
    description: '',
    images: [] as string[],
    capacity: 1,
    bedType: 'King',
    size: 400,
    isAC: true,
    available: true,
    amenities: [] as string[]
  });

  const createRoomMutation = useMutation({
    mutationFn: (roomData: typeof formData) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(roomData)
      }),
    onSuccess: () => {
      toast.success('Room added successfully');
      navigate('/admin/dashboard/rooms');
    },
    onError: () => {
      toast.error('Failed to add room');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Add New Room</h1>
      <p className="text-muted-foreground mb-8">Create a new room for the hotel</p>
      <Link to="/admin/dashboard/rooms"><Button variant="ghost" className="mb-4">Back to Rooms</Button></Link>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Room Name*</label>
            <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Room Type</label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value as Room['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
                <SelectItem value="Presidential">Presidential</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price per Night (₹)*</label>
            <Input type="number" value={formData.price} onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount Price (₹)</label>
            <Input type="number" value={formData.discountPrice} onChange={(e) => handleChange('discountPrice', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Short Description</label>
          <Textarea value={formData.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Detailed Description</label>
          <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required />
        </div>
        <h2 className="text-xl font-semibold mb-4">Room Images</h2>
        <ImageUpload onChange={(files) => handleChange('images', files)} />
        <h2 className="text-xl font-semibold mb-4">Room Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Capacity</label>
            <Input type="number" value={formData.capacity} onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bed Type</label>
            <Input value={formData.bedType} onChange={(e) => handleChange('bedType', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Room Size (sqft)</label>
            <Input type="number" value={formData.size} onChange={(e) => handleChange('size', parseInt(e.target.value) || 0)} required />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="isAC">Air Conditioning</Label>
            <Switch id="isAC" checked={formData.isAC} onCheckedChange={(checked) => handleChange('isAC', checked)} />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="available">Available for Booking</Label>
            <Switch id="available" checked={formData.available} onCheckedChange={(checked) => handleChange('available', checked)} />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Amenities (comma separated)</label>
          <Textarea
            value={formData.amenities.join(', ')}
            onChange={(e) => handleChange('amenities', e.target.value.split(',').map(s => s.trim()))}
            placeholder="WiFi, Parking, AC, Breakfast..."
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit">Add Room</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminAddRoom;