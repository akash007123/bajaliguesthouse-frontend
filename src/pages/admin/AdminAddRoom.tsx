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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Upload,
  Wifi,
  Coffee,
  Car,
  Tv,
  Wind,
  Dumbbell,
  Waves,
  Utensils,
  Shield,
  Plus,
  X,
  Check
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
            <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4" />
              Back to Rooms
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Add New Room
          </h1>
          <p className="text-muted-foreground text-lg">Create a new room listing for the homestay</p>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          {['Basic Info', 'Room Details', 'Amenities', 'Images', 'Review'].map((step, index) => {
            const stepTabs = ['basic', 'details', 'amenities', 'images', 'review'];
            const isActive = activeTab === stepTabs[index];
            const isCompleted = stepTabs.indexOf(activeTab) > index;
            
            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2
                    ${isActive ? 'border-amber-500 bg-amber-500 text-white' : ''}
                    ${isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'border-border bg-card text-muted-foreground' : ''}
                    transition-all duration-300
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${isActive ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`
                    w-20 h-0.5 mx-2
                    ${isCompleted ? 'bg-emerald-500' : 'bg-border'}
                    transition-all duration-300
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              {activeTab === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
                    <p className="text-muted-foreground mb-6">Provide essential details about the room</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                          Room Name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="e.g., Ocean View Suite"
                          className="h-12"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="type" className="text-sm font-medium mb-2 block">
                          Room Type
                        </Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange('type', value as Room['type'])}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{type.label}</span>
                                  <span className="text-xs text-muted-foreground">{type.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium mb-2 block">
                          Price per Night (₹) <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                            className="h-12 pl-8"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="discountPrice" className="text-sm font-medium mb-2 block">
                          Discount Price (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                          <Input
                            id="discountPrice"
                            type="number"
                            value={formData.discountPrice || ''}
                            onChange={(e) => handleChange('discountPrice', parseInt(e.target.value) || 0)}
                            className="h-12 pl-8"
                          />
                        </div>
                        {formData.discountPrice > 0 && formData.discountPrice < formData.price && (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                              Save ₹{(formData.price - formData.discountPrice).toLocaleString()} per night
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shortDescription" className="text-sm font-medium mb-2 block">
                          Short Description
                        </Label>
                        <Textarea
                          id="shortDescription"
                          value={formData.shortDescription}
                          onChange={(e) => handleChange('shortDescription', e.target.value)}
                          placeholder="Brief description (appears in listings)"
                          className="min-h-32"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Keep it concise (max 200 characters)
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                          Detailed Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          placeholder="Detailed room description including features and highlights"
                          className="min-h-40"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Room Details */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Room Specifications</h3>
                    <p className="text-muted-foreground mb-6">Configure room capacity and features</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="capacity" className="text-sm font-medium mb-2 block">
                        Capacity <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleChange('capacity', Math.max(1, formData.capacity - 1))}
                          className="h-12 w-12"
                        >
                          <span className="text-xl">-</span>
                        </Button>
                        <div className="flex-1 text-center">
                          <span className="text-3xl font-bold text-foreground">{formData.capacity}</span>
                          <p className="text-sm text-muted-foreground">guest{formData.capacity !== 1 ? 's' : ''}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleChange('capacity', formData.capacity + 1)}
                          className="h-12 w-12"
                        >
                          <span className="text-xl">+</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bedType" className="text-sm font-medium mb-2 block">
                        Bed Type
                      </Label>
                      <Select value={formData.bedType} onValueChange={(value) => handleChange('bedType', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select bed type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BED_TYPES.map((bed) => (
                            <SelectItem key={bed} value={bed}>
                              {bed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="size" className="text-sm font-medium mb-2 block">
                        Room Size (sqft)
                      </Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.size || ''}
                        onChange={(e) => handleChange('size', parseInt(e.target.value) || 0)}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Additional Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-border/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Wind className="w-5 h-5 text-cyan-500" />
                          </div>
                          <div>
                            <Label htmlFor="isAC" className="font-medium cursor-pointer">
                              Air Conditioning
                            </Label>
                            <p className="text-sm text-muted-foreground">Climate control system</p>
                          </div>
                        </div>
                        <Switch
                          id="isAC"
                          checked={formData.isAC}
                          onCheckedChange={(checked) => handleChange('isAC', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-border/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <Label htmlFor="available" className="font-medium cursor-pointer">
                              Available for Booking
                            </Label>
                            <p className="text-sm text-muted-foreground">Make room bookable</p>
                          </div>
                        </div>
                        <Switch
                          id="available"
                          checked={formData.available}
                          onCheckedChange={(checked) => handleChange('available', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Amenities */}
              {activeTab === 'amenities' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Amenities & Services</h3>
                    <p className="text-muted-foreground mb-6">Select amenities included with this room</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity.label);
                      const Icon = amenity.icon;
                      
                      return (
                        <div
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.label)}
                          className={`
                            p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                            ${isSelected 
                              ? 'border-amber-500 bg-amber-500/5' 
                              : 'border-border hover:border-amber-500/30 hover:bg-amber-500/5'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${amenity.color} bg-current/10`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-border'}
                            `}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          <h4 className="font-semibold">{amenity.label}</h4>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <Label htmlFor="customAmenities" className="text-sm font-medium mb-2 block">
                      Custom Amenities (comma separated)
                    </Label>
                    <Textarea
                      id="customAmenities"
                      value={formData.amenities.filter(a => !AMENITY_OPTIONS.some(o => o.label === a)).join(', ')}
                      onChange={(e) => {
                        const customAmenities = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        const preSelected = formData.amenities.filter(a => AMENITY_OPTIONS.some(o => o.label === a));
                        handleChange('amenities', [...preSelected, ...customAmenities]);
                      }}
                      placeholder="Add custom amenities not listed above"
                      className="min-h-24"
                    />
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Selected Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity) => {
                          const amenityOption = AMENITY_OPTIONS.find(o => o.label === amenity);
                          const Icon = amenityOption?.icon;
                          
                          return (
                            <Badge
                              key={amenity}
                              variant="outline"
                              className="gap-2 px-3 py-2"
                              onClick={() => handleAmenityToggle(amenity)}
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              {amenity}
                              <X className="w-3 h-3 ml-1 cursor-pointer" />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Images */}
              {activeTab === 'images' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Room Images</h3>
                    <p className="text-muted-foreground mb-6">Upload high-quality images of the room (5-10 recommended)</p>
                  </div>
                  
                  <ImageUpload 
                    onChange={handleImageUpload}
                    maxImages={10}
                  />
                  
                  {formData.images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Selected Images ({formData.images.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={image} 
                                alt={`Room image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleChange('images', formData.images.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Review */}
              {activeTab === 'review' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Review Room Details</h3>
                    <p className="text-muted-foreground mb-6">Review all information before creating the room</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Room Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Name</span>
                            <span className="font-semibold">{formData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Type</span>
                            <span className="font-semibold">{formData.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price per Night</span>
                            <div className="flex items-center gap-2">
                              {formData.discountPrice > 0 && formData.discountPrice < formData.price ? (
                                <>
                                  <span className="text-muted-foreground line-through">₹{formData.price}</span>
                                  <span className="font-bold text-amber-500">₹{formData.discountPrice}</span>
                                </>
                              ) : (
                                <span className="font-bold">₹{formData.price}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capacity</span>
                            <span className="font-semibold">{formData.capacity} guest{formData.capacity !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bed Type</span>
                            <span className="font-semibold">{formData.bedType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Size</span>
                            <span className="font-semibold">{formData.size} sqft</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Features & Amenities</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Air Conditioning</span>
                            <Badge variant={formData.isAC ? 'default' : 'outline'}>
                              {formData.isAC ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Available for Booking</span>
                            <Badge variant={formData.available ? 'default' : 'outline'}>
                              {formData.available ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground block mb-2">Amenities ({formData.amenities.length})</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground block mb-2">Images ({formData.images.length})</span>
                            <div className="flex gap-2">
                              {formData.images.slice(0, 3).map((image, index) => (
                                <div key={index} className="w-12 h-12 rounded overflow-hidden bg-muted">
                                  <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {formData.images.length > 3 && (
                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                  <span className="text-sm font-semibold">+{formData.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3">Description</h4>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Short Description</span>
                          <p>{formData.shortDescription || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Full Description</span>
                          <p className="whitespace-pre-wrap">{formData.description || 'Not provided'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevTab}
                  disabled={activeTab === 'basic'}
                >
                  Previous
                </Button>
                
                {activeTab === 'review' ? (
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    disabled={createRoomMutation.isPending}
                  >
                    {createRoomMutation.isPending ? 'Creating Room...' : 'Create Room'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextTab}
                  >
                    Continue
                  </Button>
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