import React, { useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Eye, User, Phone, Mail, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/types/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle, XCircle } from 'lucide-react';

interface UsersTableProps {
  users: UserType[];
  loading: boolean;
  onView: (user: UserType) => void;
  onToggleStatus: (userId: string, currentStatus: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onView, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: UserType) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {user.name?.slice(0, 2).toUpperCase() || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (user: UserType) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="font-medium">{user.mobile || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: UserType) => (
        <Badge
          variant={user.status === 'active' ? 'default' : 'secondary'}
          className={`${user.status === 'active'
              ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20'
              : 'bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-500/20'
            }`}
        >
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (user: UserType) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => onView(user)}
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
              <DropdownMenuItem onClick={() => onView(user)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(user._id, user.status)}
                className={user.status === 'active' ? 'text-rose-600' : 'text-emerald-600'}
              >
                {user.status === 'active' ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate User
                  </>
                )}
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
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>
              Manage user accounts and access ({users.length} total)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={paginatedUsers}
          keyExtractor={(user) => user._id}
          emptyMessage="No users found"
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

export default UsersTable;