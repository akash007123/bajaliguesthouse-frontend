import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Edit,
  Plus,
  Eye,
  Star,
  MapPin,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface Darshan {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  time: string;
  location: string;
  category: string;
  isActive: boolean;
}

const AdminDarshans: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const { data: darshans = [], isLoading } = useQuery<Darshan[]>({
    queryKey: ['adminDarshans'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/darshans`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`${import.meta.env.VITE_API_URL}/admin/darshans/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDarshans'] });
      toast.success('Darshan deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete darshan');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/darshans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDarshans'] });
      toast.success('Darshan status updated');
    },
    onError: () => {
      toast.error('Failed to update darshan status');
    }
  });

  const filteredDarshans = darshans.filter(darshan => {
    const matchesSearch = !searchTerm ||
      darshan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      darshan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      darshan.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && darshan.isActive) ||
      (statusFilter === 'Inactive' && !darshan.isActive);

    const matchesCategory = categoryFilter === 'All' || darshan.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditDarshan = (darshan: Darshan) => {
    if (!darshan.id) {
      toast.error('Invalid darshan ID');
      return;
    }
    navigate(`/admin/dashboard/darshans/edit/${darshan.id}`);
  };

  const handleToggleActive = (darshan: Darshan) => {
    toggleActiveMutation.mutate({ id: darshan.id, isActive: !darshan.isActive });
  };

  const categories = Array.from(new Set(darshans.map(darshan => darshan.category)));
  const stats = {
    total: darshans.length,
    active: darshans.filter(d => d.isActive).length,
    inactive: darshans.filter(d => !d.isActive).length,
    averageRating: darshans.length > 0 ? darshans.reduce((sum, d) => sum + d.rating, 0) / darshans.length : 0
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
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
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Darshans Management
          </h1>
          <p className="text-muted-foreground text-lg">Manage Ujjain darshan attractions</p>
        </div>
        <Link to="/admin/dashboard/darshans/add">
          <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4" />
            Add New Darshan
          </Button>
        </Link>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Darshans</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-rose-500 mt-1">{stats.inactive}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search darshans by name, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-96"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All') && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('All');
                      setCategoryFilter('All');
                    }}
                    className="text-muted-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Darshans Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDarshans.map((darshan, index) => (
              <motion.div
                key={darshan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className="border-border/50 hover:shadow-xl transition-all duration-300 h-full group overflow-hidden">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                      <img
                        src={darshan.image}
                        alt={darshan.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={darshan.isActive ? 'default' : 'secondary'}
                          className={`${darshan.isActive
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-rose-500 hover:bg-rose-600'
                          }`}
                        >
                          {darshan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">{darshan.name}</h3>
                          <p className="text-sm text-muted-foreground">{darshan.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{darshan.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {darshan.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{darshan.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{darshan.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(darshan)}
                          className="gap-1"
                        >
                          {darshan.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditDarshan(darshan)}
                            className="gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="gap-1">
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Darshan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{darshan.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(darshan.id)}
                                  className="bg-rose-500 hover:bg-rose-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredDarshans.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No darshans found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : 'No darshans have been added yet. Get started by adding your first darshan!'}
            </p>
            {(searchTerm || statusFilter !== 'All' || categoryFilter !== 'All') ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setCategoryFilter('All');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link to="/admin/dashboard/darshans/add">
                <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600">
                  <Plus className="w-4 h-4" />
                  Add Your First Darshan
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminDarshans;