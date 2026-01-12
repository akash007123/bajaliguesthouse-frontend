import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StaffMember } from '@/types/index';

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

const ViewStaffModal: React.FC<ViewStaffModalProps> = ({ isOpen, onClose, staff }) => {
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{staff.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{staff.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <p className="mt-1 text-sm text-gray-900">{staff.mobile}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{staff.role}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{staff.address}</p>
            </div>
          </div>

          {staff.profilePic && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <img src={staff.profilePic} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded" />
            </div>
          )}

          {staff.bankPassbook && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Passbook</label>
              <img src={staff.bankPassbook} alt="Bank Passbook" className="mt-2 w-32 h-32 object-cover rounded" />
            </div>
          )}

          {staff.documents && staff.documents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Documents</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {staff.documents.map((doc, index) => (
                  <div key={index} className="border rounded p-2">
                    <p className="text-sm font-medium">{doc.name}</p>
                    <img src={doc.file} alt={doc.name} className="mt-2 w-32 h-32 object-cover rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {staff.bankDetails && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Details</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Bank Name</label>
                  <p className="text-sm text-gray-900">{staff.bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Account Number</label>
                  <p className="text-sm text-gray-900">{staff.bankDetails.accountNo}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">IFSC</label>
                  <p className="text-sm text-gray-900">{staff.bankDetails.ifsc}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Branch</label>
                  <p className="text-sm text-gray-900">{staff.bankDetails.branch}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(staff.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Updated At</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(staff.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStaffModal;