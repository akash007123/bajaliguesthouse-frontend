import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Wifi,
  Coffee,
  Car,
  Tv,
  Wind,
  Dumbbell,
  Waves,
  Utensils,
  Shield,
  Check,
  X,
  CreditCard,
  MapPin,
  ImageIcon
} from 'lucide-react';

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'WiFi', icon: Wifi, color: 'text-blue-500' },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-amber-500' },
  { id: 'parking', label: 'Parking', icon: Car, color: 'text-emerald-500' },
  { id: 'tv', label: 'TV', icon: Tv, color: 'text-purple-500' },
  { id: 'ac', label: 'Air Conditioning', icon: Wind, color: 'text-cyan-500' },
  { id: 'gym', label: 'Gym Access', icon: Dumbbell, color: 'text-rose-500' },
  { id: 'pool', label: 'Swimming Pool', icon: Waves, color: 'text-sky-500' },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils, color: 'text-orange-500' },
  { id: 'safe', label: 'Safe', icon: Shield, color: 'text-slate-500' },
];

const ROOM_TYPES = [
  { value: 'Deluxe', label: 'Deluxe Room', description: 'Luxurious comfort with premium amenities' },
  { value: 'Executive', label: 'Executive Suite', description: 'Business-friendly with workspace' },
  { value: 'Presidential', label: 'Presidential Suite', description: 'Ultimate luxury and space' },
  { value: 'Standard', label: 'Standard Room', description: 'Comfortable and affordable' },
  { value: 'Family', label: 'Family Suite', description: 'Spacious for families' },
  { value: 'Honeymoon', label: 'Honeymoon Suite', description: 'Romantic getaway' },
];

const BED_TYPES = [
  'King Bed',
  'Queen Bed',
  'Twin Beds',
  'Double Bed',
  'Single Bed',
  'Sofa Bed',
];

const AdminAddRoom: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Deluxe' as Room['type'],
    price: 0,
    discountPrice: 0,
    shortDescription: '',
    description: '',
    images: [] as string[],
    capacity: 1,
    bedType: 'King Bed',
    size: 400,
    isAC: true,
    available: true,
    availableFrom: '',
    availableTo: '',
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
      toast.success('Room added successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
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

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (images: string[]) => {
    handleChange('images', images);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleNextTab = () => {
    const tabs = ['basic', 'details', 'amenities', 'images', 'review'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const tabs = ['basic', 'details', 'amenities', 'images', 'review'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <Link to="/admin/dashboard/rooms">
            <Button variant="ghost" size="sm" className="gap-2 mb-4 hover:bg-muted/50 text-muted-foreground hover:text-foreground pl-0">
              <ArrowLeft className="w-4 h-4" />
              Back to Rooms
            </Button>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-foreground">Add New Room</h1>
          <p className="text-muted-foreground mt-1">Create a new room listing for the homestay.</p>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto px-4">
          {['Basic Info', 'Room Details', 'Amenities', 'Images', 'Review'].map((step, index) => {
            const stepTabs = ['basic', 'details', 'amenities', 'images', 'review'];
            const isActive = activeTab === stepTabs[index];
            const isCompleted = stepTabs.indexOf(activeTab) > index;

            return (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'border-gold bg-gold text-white shadow-gold scale-110' : ''}
                  ${isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'border-border bg-background text-muted-foreground' : ''}
                `}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-semibold">{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-medium uppercase tracking-wider ${isActive ? 'text-gold' : 'text-muted-foreground'}`}>
                  {step}
                </span>
                {index < 4 && (
                  <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 -z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-border'}`} style={{ width: "calc(100% + 200%)" }} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <Card className="border-border/50 shadow-lg bg-card/60 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              {activeTab === 'basic' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gold" />
                        Basic Details
                      </h3>
                      <div className="space-y-2">
                        <Label>Room Name <span className="text-rose-500">*</span></Label>
                        <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g., Ocean View Suite" required className="bg-background/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Room Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange('type', value as Room['type'])}>
                          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                <div><div className="font-medium">{t.label}</div><div className="text-xs text-muted-foreground">{t.description}</div></div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price (₹) <span className="text-rose-500">*</span></Label>
                          <Input type="number" value={formData.price || ''} onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)} required className="bg-background/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount Price (₹)</Label>
                          <Input type="number" value={formData.discountPrice || ''} onChange={(e) => handleChange('discountPrice', parseInt(e.target.value) || 0)} className="bg-background/50" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gold" />
                        Description
                      </h3>
                      <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea value={formData.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} placeholder="Brief summary..." className="bg-background/50 min-h-[80px]" required />
                        <p className="text-xs text-muted-foreground text-right">Max 200 chars</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Detailed Description</Label>
                        <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Full details..." className="bg-background/50 min-h-[140px]" required />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Room Details */}
              {activeTab === 'details' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4 p-4 border border-border/50 rounded-xl bg-background/30">
                      <Label className="text-base">Capacity</Label>
                      <div className="flex items-center justify-between">
                        <Button type="button" variant="outline" size="icon" onClick={() => handleChange('capacity', Math.max(1, formData.capacity - 1))}>-</Button>
                        <span className="text-2xl font-bold">{formData.capacity}</span>
                        <Button type="button" variant="outline" size="icon" onClick={() => handleChange('capacity', formData.capacity + 1)}>+</Button>
                      </div>
                      <p className="text-center text-sm text-muted-foreground">Guests</p>
                    </div>

                    <div className="space-y-4 p-4 border border-border/50 rounded-xl bg-background/30">
                      <Label className="text-base">Bed Type</Label>
                      <Select value={formData.bedType} onValueChange={(value) => handleChange('bedType', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {BED_TYPES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4 p-4 border border-border/50 rounded-xl bg-background/30">
                      <Label className="text-base">Room Size</Label>
                      <div className="relative">
                        <Input type="number" value={formData.size || ''} onChange={(e) => handleChange('size', parseInt(e.target.value) || 0)} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/30 hover:border-gold/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><Wind className="w-5 h-5" /></div>
                        <div><div className="font-medium">Air Conditioning</div><div className="text-xs text-muted-foreground">Climate control</div></div>
                      </div>
                      <Switch checked={formData.isAC} onCheckedChange={(c) => handleChange('isAC', c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/30 hover:border-gold/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Check className="w-5 h-5" /></div>
                        <div><div className="font-medium">Available for Booking</div><div className="text-xs text-muted-foreground">Make visible immediately</div></div>
                      </div>
                      <Switch checked={formData.available} onCheckedChange={(c) => handleChange('available', c)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Available From</Label>
                      <Input type="date" value={formData.availableFrom} onChange={(e) => handleChange('availableFrom', e.target.value)} className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Available To</Label>
                      <Input type="date" value={formData.availableTo} onChange={(e) => handleChange('availableTo', e.target.value)} className="bg-background/50" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Amenities */}
              {activeTab === 'amenities' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {AMENITY_OPTIONS.map((item) => {
                      const isSelected = formData.amenities.includes(item.label);
                      const Icon = item.icon;
                      return (
                        <div key={item.id} onClick={() => handleAmenityToggle(item.label)} className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${isSelected ? 'border-gold bg-gold/5' : 'border-border/50 hover:border-gold/30 hover:bg-muted/50'}`}>
                          <div className={`p-2 rounded-full ${isSelected ? 'bg-gold text-white' : 'bg-muted text-muted-foreground'}`}><Icon className="w-5 h-5" /></div>
                          <span className={`font-medium ${isSelected ? 'text-gold' : ''}`}>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Amenities</Label>
                    <Textarea
                      placeholder="Add other amenities separated by commas..."
                      value={formData.amenities.filter(a => !AMENITY_OPTIONS.some(o => o.label === a)).join(', ')}
                      onChange={(e) => {
                        const customs = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        const standard = formData.amenities.filter(a => AMENITY_OPTIONS.some(o => o.label === a));
                        handleChange('amenities', [...standard, ...customs]);
                      }}
                      className="bg-background/50"
                    />
                  </div>
                </motion.div>
              )}

              {/* Images */}
              {activeTab === 'images' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <ImageUpload onChange={handleImageUpload} maxImages={10} />

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => handleChange('images', formData.images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Review */}
              {activeTab === 'review' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <Card className="bg-muted/20 border-gold/20">
                    <CardHeader><CardTitle className="text-xl">Room Summary</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div><h4 className="text-sm font-medium text-muted-foreground">Name & Type</h4><p className="text-lg font-semibold">{formData.name} <span className="text-muted-foreground text-sm font-normal">({formData.type})</span></p></div>
                        <div><h4 className="text-sm font-medium text-muted-foreground">Price</h4><p className="text-lg font-bold text-gold">₹{formData.price} <span className="text-sm text-foreground font-normal">/ night</span></p></div>
                        <div><h4 className="text-sm font-medium text-muted-foreground">Capacity</h4><p>{formData.capacity} Guests • {formData.bedType}</p></div>
                        {(formData.availableFrom || formData.availableTo) && (
                          <div><h4 className="text-sm font-medium text-muted-foreground">Availability</h4><p>{formData.availableFrom ? new Date(formData.availableFrom).toLocaleDateString() : 'N/A'} - {formData.availableTo ? new Date(formData.availableTo).toLocaleDateString() : 'N/A'}</p></div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div><h4 className="text-sm font-medium text-muted-foreground">Amenities</h4><div className="flex flex-wrap gap-1 mt-1">{formData.amenities.map(a => <Badge key={a} variant="secondary">{a}</Badge>)}</div></div>
                        <div><h4 className="text-sm font-medium text-muted-foreground">Description</h4><p className="text-sm line-clamp-3">{formData.description}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-border/50">
                <Button type="button" variant="outline" onClick={handlePrevTab} disabled={activeTab === 'basic'}>Previous</Button>
                {activeTab === 'review' ? (
                  <Button type="submit" className="bg-gold hover:bg-gold-dark text-white min-w-[150px]" disabled={createRoomMutation.isPending}>
                    {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNextTab} className="bg-primary min-w-[100px]">Continue</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminAddRoom;