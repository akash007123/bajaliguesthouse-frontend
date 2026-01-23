import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Contact } from '@/types';
import ViewContactModal from '@/components/common/ViewContactModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  MoreVertical,
  ArrowUpDown,
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const AdminContacts: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);

  const { data: contactsData, isLoading } = useQuery<ContactsResponse>({
    queryKey: ['adminContacts', page],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/admin/contacts?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
      toast.success('Contact status updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update contact status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${import.meta.env.VITE_API_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
      toast.success('Contact deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete contact');
    }
  });

  const contacts = contactsData?.contacts || [];
  const pagination = contactsData?.pagination;

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateContactStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const deleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate(id);
    }
  };

  const exportToExcel = () => {
    const data = filteredContacts.map(contact => ({
      Name: contact.name,
      Email: contact.email,
      Subject: contact.subject,
      Message: contact.message,
      Status: contact.status,
      Date: format(new Date(contact.createdAt), 'MMM dd, yyyy')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
    XLSX.writeFile(wb, 'contacts.xlsx');
    toast.success('Contacts exported to Excel successfully!');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Contacts Report', 20, 10);
    const tableData = filteredContacts.map(contact => [
      contact.name,
      contact.email,
      contact.subject,
      contact.status,
      format(new Date(contact.createdAt), 'MMM dd, yyyy')
    ]);
    autoTable(doc, {
      head: [['Name', 'Email', 'Subject', 'Status', 'Date']],
      body: tableData,
      startY: 20
    });
    doc.save('contacts.pdf');
    toast.success('Contacts exported to PDF successfully!');
  };

  const statusCounts = {
    All: contacts.length,
    unread: contacts.filter(c => c.status === 'unread').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: 'destructive',
      read: 'default',
      replied: 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (contact: Contact) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{contact.name}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (contact: Contact) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{contact.email}</span>
        </div>
      )
    },
    // {
    //   key: 'subject',
    //   header: 'Subject',
    //   render: (contact: Contact) => (
    //     <span className="font-medium">{contact.subject}</span>
    //   )
    // },
    {
      key: 'status',
      header: 'Status',
      render: (contact: Contact) => getStatusBadge(contact.status)
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (contact: Contact) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{format(new Date(contact.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (contact: Contact) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => updateContactStatus(contact._id, 'read')}>
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateContactStatus(contact._id, 'replied')}>
              Mark as Replied
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteContact(contact._id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-navy-900">Contacts</h1>
          <p className="text-muted-foreground">Manage customer inquiries and messages</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminContacts'] })}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.All}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statusCounts.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{statusCounts.read}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{statusCounts.replied}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status ({statusCounts.All})</SelectItem>
                <SelectItem value="unread">Unread ({statusCounts.unread})</SelectItem>
                <SelectItem value="read">Read ({statusCounts.read})</SelectItem>
                <SelectItem value="replied">Replied ({statusCounts.replied})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={filteredContacts}
            columns={columns}
            keyExtractor={(contact) => contact._id}
            isLoading={isLoading}
            emptyMessage="No contacts found"
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* View Contact Modal */}
      {selectedContact && (
        <ViewContactModal
          contact={selectedContact}
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusUpdate={updateContactStatus}
        />
      )}
    </div>
  );
};

export default AdminContacts;