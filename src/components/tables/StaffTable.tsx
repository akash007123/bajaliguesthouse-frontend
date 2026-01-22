import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Mail, Phone, Briefcase, User } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { StaffMember } from '@/types/index';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface StaffTableProps {
  staffList: StaffMember[];
  loading: boolean;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onView: (staff: StaffMember) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList, loading, onEdit, onDelete, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(staffList.length / itemsPerPage);

  const paginatedStaff = staffList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (staff: StaffMember) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src={staff.profilePic?.[0] || ''} alt={staff.name} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {staff.name?.slice(0, 2).toUpperCase() || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-foreground">{staff.name}</p>
            <p className="text-xs text-muted-foreground">{staff.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (staff: StaffMember) => (
        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
          <Briefcase className="w-3 h-3 mr-1" />
          {staff.role}
        </Badge>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (staff: StaffMember) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-3 h-3" />
          <span>{staff.mobile}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (staff: StaffMember) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => onView(staff)}
          >
            <Eye className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(staff)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(staff)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Staff
              </DropdownMenuItem>
              <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center w-full cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Staff
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {staff.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(staff.id)} className="bg-rose-600 hover:bg-rose-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>
              Manage employee details and roles ({staffList.length} total)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={paginatedStaff}
          keyExtractor={(staff) => staff.id}
          emptyMessage="No staff members found"
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StaffTable;