'use client';

import React from 'react';
import CrudPageLayout from '@/components/layout/CrudPageLayout'; 
import BranchFormModal from '@/components/ui/BranchFormModal'; 

export default function BranchesPage() {
    const tableColumns = [
        { 
            key: 'branch_no', label: 'Branch No.',
            render: (val) => <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{val}</span> 
        },
        { 
            key: 'address', label: 'Full Address',
            render: (val, row) => (
                <div className="text-xs text-gray-500">
                    <p className="text-gray-900 font-medium">{row.street}, {row.area}, {row.city}</p>
                    <p>{row.postcode}</p>
                </div>
            )
        },
        { key: 'telephone_no', label: 'Contact No.' },
        { 
            key: 'manager', label: 'Manager',
            render: (val) => (
                <span className={`text-sm ${val ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}`}>
                    {val || "Unassigned"}
                </span>
            )
        },
    ];

    return (
        <CrudPageLayout
            title="Branch Operations"
            subtitle="Manage DreamHome office locations and contact details."
            addButtonLabel="+ New Branch"
            endpoint="/branches/"
            keyField="branch_no"
            columns={tableColumns}
            getDeleteModalItemName={(branch) => `Branch ${branch.branch_no} - ${branch.city}`}
            renderFormModal={({ isOpen, onClose, onSuccess, itemToEdit }) => (
                <BranchFormModal 
                    isOpen={isOpen} 
                    onClose={onClose} 
                    onSuccess={onSuccess} 
                    branchToEdit={itemToEdit} 
                />
            )}
        />
    );
}