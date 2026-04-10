'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable'; 
import BranchFormModal from '@/components/ui/BranchFormModal'; // Adjust paths as needed
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 
import apiClient from '@/lib/apiClient';

export default function BranchesPage() {
    // Data State
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [branchToEdit, setBranchToEdit] = useState(null);
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);

    // Fetch Function (extracted so we can call it after adding/editing/deleting)
    const loadBranches = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/branches/');
            setBranches(data.items || data);
        } catch (error) {
            console.error("Failed to load branches:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load initially
    useEffect(() => { loadBranches(); }, []);

    // Open Modals
    const handleAddClick = () => {
        setBranchToEdit(null); // Null means "Add Mode"
        setIsFormOpen(true);
    };

    const handleEditClick = (branch) => {
        setBranchToEdit(branch); // Passing data means "Edit Mode"
        setIsFormOpen(true);
    };

    const handleDeleteClick = (branch) => {
        setBranchToDelete(branch);
        setIsDeleteOpen(true);
    };

    // Table Configuration
    const tableColumns = [
        { 
            key: 'branch_no', label: 'Branch ID',
            render: (val) => <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{val}</span> 
        },
        { key: 'area', label: 'Barangay' },
        { key: 'city', label: 'City' },
        { 
            key: 'address', label: 'Full Address',
            render: (val, row) => (
                <div className="text-xs text-gray-500">
                    <p className="text-gray-900 font-medium">{row.street}</p>
                    <p>{row.postcode}</p>
                </div>
            )
        },
        { key: 'telephone_no', label: 'Contact No.' },
    ];

    const renderActions = (row) => (
        <div className="flex justify-end gap-3">
            <button onClick={(e) => { e.stopPropagation(); handleEditClick(row); }} className="text-blue-600 hover:text-blue-900 text-sm font-semibold">
                Edit
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} className="text-red-600 hover:text-red-900 text-sm font-semibold">
                Delete
            </button>
        </div>
    );

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Branch Operations</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage DreamHome office locations and contact details.</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    + New Branch
                </button>
            </div>

            <DataTable 
                columns={tableColumns} 
                data={branches} 
                keyField="branch_no"
                isLoading={isLoading}
                actions={renderActions}
            />

            {/* Modals are hidden until triggered */}
            <BranchFormModal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSuccess={loadBranches} // 🌟 Refreshes the table automatically!
                branchToEdit={branchToEdit} 
            />

            {/* Using the Universal Delete Modal! */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadBranches}
                endpoint="/branches"
                idToDelete={branchToDelete?.branch_no}
                itemName={`Branch ${branchToDelete?.branch_no} - ${branchToDelete?.city}`}
            />
        </div>
    );
}