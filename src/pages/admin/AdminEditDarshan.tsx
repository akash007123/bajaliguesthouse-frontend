import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Temple',
  'Ghat',
  'Palace',
  'Cave',
  'Museum',
  'Park',
  'Other'
];

const AdminEditDarshan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    rating: 4.0,
    time: '',
    location: '',
    category: 'Temple',
    isActive: true
  });

  const { data: darshan, isLoading } = useQuery({
    queryKey: ['darshan', id],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/darshans/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    enabled: !!id
  });

  useEffect(() => {
    if (darshan) {
      setFormData({
        name: darshan.name || '',
        description: darshan.description || '',
        image: darshan.image || '',
        rating: darshan.rating || 4.0,
        time: darshan.time || '',
        location: darshan.location || '',
        category: darshan.category || 'Temple',
        isActive: darshan.isActive ?? true
      });
    }
  }, [darshan]);

  const updateDarshanMutation = useMutation({
    mutationFn: (darshanData: typeof formData) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/darshans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(darshanData)
      }),
    onSuccess: () => {
      toast.success('Darshan updated successfully!');
      navigate('/admin/dashboard/darshans');
    },
    onError: () => {
      toast.error('Failed to update darshan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDarshanMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
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
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <Link to="/admin/dashboard/darshans">
            <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4" />
              Back to Darshans
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Edit Darshan
          </h1>
          <p className="text-muted-foreground text-lg">Update darshan attraction details</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Darshan Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Mahakaleshwar Temple"
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating" className="text-sm font-medium mb-2 block">
                      Rating (1-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 4.0)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-sm font-medium mb-2 block">
                      Opening Hours <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="time"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      placeholder="e.g., 6:00 AM - 10:00 PM"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                      Location <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g., Mahakal Lok, Ujjain"
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-sm font-medium mb-2 block">
                      Image URL <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a direct link to the image
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active (visible to public)
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Description <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Detailed description of the darshan attraction"
                  className="min-h-32"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-border/50">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  disabled={updateDarshanMutation.isPending}
                >
                  {updateDarshanMutation.isPending ? 'Updating Darshan...' : 'Update Darshan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminEditDarshan;