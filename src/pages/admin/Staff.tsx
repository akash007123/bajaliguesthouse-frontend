import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddStaffModal } from '@/components/forms/AddStaffModal';
import { EditStaffModal } from '@/components/forms/EditStaffModal.tsx';
import StaffTable from '@/components/tables/StaffTable';
import ViewStaffModal from '@/components/common/ViewStaffModal';
import { StaffMember } from '@/types/index';

interface StaffFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  bankPassbook: File[];
  profilePic: File[];
  documents: { name: string; file: File[] }[];
  bankDetails: {
    enabled: boolean;
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
}

const Staff: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedStaffForView, setSelectedStaffForView] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/staff', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStaffList(data);
      } else {
        console.error('Failed to fetch staff, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = (data: StaffFormData) => {
    // Staff added successfully, modal handles the API call
    console.log('Staff added:', data);
    fetchStaff(); // Refresh the list
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaffForView(staff);
    setIsViewModalOpen(true);
  };

  const handleUpdateStaff = () => {
    fetchStaff(); // Refresh the list
    setIsEditModalOpen(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchStaff(); // Refresh the list
      } else {
        console.error('Failed to delete staff');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage homestay staff members</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <StaffTable
        staffList={staffList}
        loading={loading}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
        onView={handleViewStaff}
      />

      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStaff}
      />

      {selectedStaff && (
        <EditStaffModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onSubmit={handleUpdateStaff}
        />
      )}

      <ViewStaffModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStaffForView(null);
        }}
        staff={selectedStaffForView}
      />
    </div>
  );
};

export default Staff;