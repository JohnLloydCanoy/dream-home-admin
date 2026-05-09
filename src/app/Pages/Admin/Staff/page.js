'use client';

import React from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout'; 
import StaffFormModal from '@/components/ui/StaffFormModal'; 

export default function StaffDirectoryPage() {
    const tableColumns = [
        { 
            key: 'staff_no', label: 'Staff No.',
            render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{val}</span> 
        },
        { 
            key: 'name', label: 'Full Name',
            render: (val, row) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span>
        },
        { 
            key: 'position', label: 'Position',
            render: (val) => {
                const colors = {
                    'Manager': 'bg-green-100 text-green-800',
                    'Supervisor': 'bg-blue-100 text-blue-800',
                    'Secretary': 'bg-orange-100 text-orange-800',
                    'Staff': 'bg-gray-100 text-gray-800'
                };
                const descriptions = {
                    'Manager': 'Manages the branch',
                    'Supervisor': 'In charge of 10 staff each branch',
                    'Secretary': 'General administrative duties',
                    'Staff': 'Regular generic staff'
                };
                return (
                    <span 
                        title={descriptions[val] || descriptions['Staff']} 
                        className={`px-2 py-1 rounded-full text-xs font-bold cursor-help ${colors[val] || colors['Staff']}`}
                    >
                        {val}
                    </span>
                );
            }
        },
        { 
            key: 'branch', label: 'Branch',
            render: (val) => val ? (typeof val === 'object' ? val.city : val) : 'Unassigned'
        },
        { key: 'telephone_no', label: 'Contact No.' },
        { key: 'salary', label: 'Salary', render: (val) => `Ph ${val}` },
        { key: 'roles', label: 'Roles', render: (val) => Array.isArray(val) ? val.join(', ') : (val || 'None') }
    ];

    return (
        <CrudPageLayout
            title="Staff Directory"
            subtitle="Manage DreamHome employees, roles, and kinship profiles."
            addButtonLabel="+ Enroll Staff"
            endpoint="/users/staff/"
            keyField="staff_no"
            columns={tableColumns}
            getDeleteModalItemName={(staff) => `${staff.first_name} ${staff.last_name} (${staff.staff_no})`}
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <StaffFormModal 
                    isOpen={isOpen} 
                    onClose={onClose} 
                    onSuccess={onSuccess} 
                    staffToEdit={itemToEdit} 
                />
            )}
        />
    );
}