import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
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

const AdminRooms: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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


  const handleEditRoom = (room: Room) => {
    if (!room.id) {
      toast.error('Invalid room ID');
      return;
    }
    navigate(`/admin/dashboard/rooms/edit/${room.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Rooms Management</h1>
          <p className="text-muted-foreground">Manage hotel rooms</p>
        </div>
        <Link to="/admin/dashboard/rooms/add"><Button>Add New Room</Button></Link>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Price/Night</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Available</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.id || `room-${index}`} className="border-b border-border">
                  <td className="py-3 px-4 text-sm">{room.id}</td>
                  <td className="py-3 px-4 text-sm">{room.name}</td>
                  <td className="py-3 px-4 text-sm">{room.type}</td>
                  <td className="py-3 px-4 text-sm">${room.price}</td>
                  <td className="py-3 px-4">
                    <Badge variant={room.available ? 'default' : 'secondary'}>
                      {room.available ? 'Available' : 'Occupied'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditRoom(room)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the room.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(room.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminRooms;