import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FileUpload } from './FileUpload';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface DocumentEntry {
  name: string;
  file: File[];
}

interface StaffFormData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  bankPassbook: File[];
  profilePic: File[];
  documents: DocumentEntry[];
  bankDetails: {
    enabled: boolean;
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  profilePic?: string;
  bankPassbook?: string;
  documents: { name: string; file: string }[];
  bankDetails?: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember;
  onSubmit: () => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({ isOpen, onClose, staff, onSubmit }) => {
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    email: '',
    mobile: '',
    address: '',
    role: '',
    bankPassbook: [],
    profilePic: [],
    documents: [],
    bankDetails: {
      enabled: false,
      bankName: '',
      accountNo: '',
      ifsc: '',
      branch: ''
    }
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        mobile: staff.mobile,
        address: staff.address,
        role: staff.role,
        bankPassbook: [],
        profilePic: [],
        documents: staff.documents.map(doc => ({ name: doc.name, file: [] })),
        bankDetails: staff.bankDetails ? {
          enabled: true,
          bankName: staff.bankDetails.bankName,
          accountNo: staff.bankDetails.accountNo,
          ifsc: staff.bankDetails.ifsc,
          branch: staff.bankDetails.branch
        } : {
          enabled: false,
          bankName: '',
          accountNo: '',
          ifsc: '',
          branch: ''
        }
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobile', formData.mobile);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('bankDetails', JSON.stringify(formData.bankDetails));

    // Append files
    if (formData.profilePic.length > 0) {
      formDataToSend.append('profilePic', formData.profilePic[0]);
    }
    if (formData.bankPassbook.length > 0) {
      formDataToSend.append('bankPassbook', formData.bankPassbook[0]);
    }
    formData.documents.forEach((doc, index) => {
      if (doc.file.length > 0) {
        formDataToSend.append('documents', doc.file[0]);
        formDataToSend.append('documentNames', doc.name);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/staff/${staff.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        onSubmit();
        onClose();
      } else {
        console.error('Failed to update staff');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { name: '', file: [] }]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const updateDocument = (index: number, field: keyof DocumentEntry, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <FormInput
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              required
            />
            <FormInput
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              required
            />
          </div>
          <FormTextarea
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            required
          />
          <FileUpload
            label="Profile Picture"
            value={formData.profilePic}
            onChange={(files) => setFormData(prev => ({ ...prev, profilePic: files }))}
            maxFiles={1}
            accept="image/*"
          />
          <FileUpload
            label="Bank Passbook"
            value={formData.bankPassbook}
            onChange={(files) => setFormData(prev => ({ ...prev, bankPassbook: files }))}
            maxFiles={1}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Additional Documents</Label>
              <Button type="button" variant="outline" size="sm" onClick={addDocument}>
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </div>
            {formData.documents.map((doc, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Document {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <FormInput
                  label="Document Name"
                  value={doc.name}
                  onChange={(e) => updateDocument(index, 'name', e.target.value)}
                  required
                />
                <FileUpload
                  label="Document File"
                  value={doc.file}
                  onChange={(files) => updateDocument(index, 'file', files)}
                  maxFiles={1}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="bankDetails"
                checked={formData.bankDetails.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, enabled: e.target.checked }
                }))}
              />
              <Label htmlFor="bankDetails">Include Bank Details</Label>
            </div>
            {formData.bankDetails.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Bank Name"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                  }))}
                />
                <FormInput
                  label="Account Number"
                  value={formData.bankDetails.accountNo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, accountNo: e.target.value }
                  }))}
                />
                <FormInput
                  label="IFSC Code"
                  value={formData.bankDetails.ifsc}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, ifsc: e.target.value }
                  }))}
                />
                <FormInput
                  label="Branch Name"
                  value={formData.bankDetails.branch}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, branch: e.target.value }
                  }))}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Staff</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};