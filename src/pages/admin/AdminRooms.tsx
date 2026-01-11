import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Eye, 
  Bed, 
  DollarSign, 
  Users, 
  Building, 
  Star,
  Filter,
  Search,
  Calendar,
  Wifi,
  Coffee,
  Car,
  Bath
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const AdminRooms: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['adminRooms'],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/rooms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`${import.meta.env.VITE_API_URL}/admin/rooms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      toast.success('Room deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete room');
    }
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/rooms/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ available })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRooms'] });
      toast.success('Room availability updated');
    },
    onError: () => {
      toast.error('Failed to update room availability');
    }
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !searchTerm ||
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Available' && room.available) ||
      (statusFilter === 'Occupied' && !room.available);
    
    const matchesType = typeFilter === 'All' || room.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEditRoom = (room: Room) => {
    if (!room.id) {
      toast.error('Invalid room ID');
      return;
    }
    navigate(`/admin/dashboard/rooms/edit/${room.id}`);
  };

  const handleToggleAvailability = (room: Room) => {
    toggleAvailabilityMutation.mutate({ id: room.id, available: !room.available });
  };

  const roomTypes = Array.from(new Set(rooms.map(room => room.type)));
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.available).length,
    occupied: rooms.filter(r => !r.available).length,
    averagePrice: rooms.length > 0 ? rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length : 0
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'breakfast': return <Coffee className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'bath': return <Bath className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
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
            Rooms Management
          </h1>
          <p className="text-muted-foreground text-lg">Manage and monitor all hotel rooms</p>
        </div>
        <Link to="/admin/dashboard/rooms/add">
          <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4" />
            Add New Room
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
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-500" />
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
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.available}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Bed className="w-6 h-6 text-emerald-500" />
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
                  <p className="text-sm text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold text-rose-500 mt-1">{stats.occupied}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-rose-500" />
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
                  <p className="text-sm text-muted-foreground">Avg. Price</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">₹{stats.averagePrice.toFixed(0)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-500" />
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
                    placeholder="Search rooms by name, type, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-96"
                  />
                </div>
              </div>

              {/* Filters and View Toggle */}
              <div className="flex flex-wrap items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Bed className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    List
                  </Button>
                </div>

                {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('All');
                      setTypeFilter('All');
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

      {/* Rooms Display */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="border-border/50 hover:shadow-xl transition-all duration-300 h-full group overflow-hidden">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building className="w-16 h-16 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Badge 
                              variant={room.available ? 'default' : 'secondary'}
                              className={`${room.available 
                                ? 'bg-emerald-500 hover:bg-emerald-600' 
                                : 'bg-rose-500 hover:bg-rose-600'
                              }`}
                            >
                              {room.available ? 'Available' : 'Occupied'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-1">{room.name}</h3>
                              <p className="text-sm text-muted-foreground">{room.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-amber-500">₹{room.price}</p>
                              <p className="text-xs text-muted-foreground">per night</p>
                            </div>
                          </div>
                          
                          {room.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {room.description}
                            </p>
                          )}

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-foreground mb-2">Amenities</p>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.slice(0, 3).map((amenity, idx) => (
                                  <Badge key={idx} variant="outline" className="gap-1">
                                    {getAmenityIcon(amenity)}
                                    <span>{amenity}</span>
                                  </Badge>
                                ))}
                                {room.amenities.length > 3 && (
                                  <Badge variant="outline" className="text-muted-foreground">
                                    +{room.amenities.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>Max: {room.capacity || 2} guests</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditRoom(room)}
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
                                    <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{room.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteMutation.mutate(room.id)}
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
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Rooms</CardTitle>
                      <CardDescription>
                        {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Room</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Type</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Price</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Capacity</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRooms.map((room, index) => (
                          <motion.tr
                            key={room.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                                  <Building className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                  <p className="font-semibold">{room.name}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {room.description || 'No description'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant="outline" className="capitalize">
                                {room.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">₹{room.price}</span>
                                <span className="text-sm text-muted-foreground">/night</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{room.capacity || 2} guests</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col gap-2">
                                <Badge 
                                  variant={room.available ? 'default' : 'secondary'}
                                  className={`w-fit ${room.available 
                                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                                    : 'bg-rose-500 hover:bg-rose-600'
                                  }`}
                                >
                                  {room.available ? 'Available' : 'Occupied'}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs"
                                  onClick={() => handleToggleAvailability(room)}
                                  disabled={toggleAvailabilityMutation.isPending}
                                >
                                  {room.available ? 'Mark as Occupied' : 'Mark as Available'}
                                </Button>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditRoom(room)}
                                  className="gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="gap-2"
                                      onClick={() => handleEditRoom(room)}
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit Room
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="gap-2 text-emerald-600"
                                      onClick={() => handleToggleAvailability(room)}
                                    >
                                      {room.available ? (
                                        <>
                                          <Users className="w-4 h-4" />
                                          Mark as Occupied
                                        </>
                                      ) : (
                                        <>
                                          <Bed className="w-4 h-4" />
                                          Mark as Available
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 text-rose-600">
                                      <AlertDialogTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                          <Trash2 className="w-4 h-4" />
                                          Delete Room
                                        </div>
                                      </AlertDialogTrigger>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Building className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'No rooms have been added yet. Get started by adding your first room!'}
            </p>
            {(searchTerm || statusFilter !== 'All' || typeFilter !== 'All') ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setTypeFilter('All');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link to="/admin/dashboard/rooms/add">
                <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600">
                  <Plus className="w-4 h-4" />
                  Add Your First Room
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminRooms;