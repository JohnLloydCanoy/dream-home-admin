'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable'; 
import StaffFormModal from '@/components/ui/StaffFormModal'; 
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 
import apiClient from '@/lib/apiClient';

export default function StaffDirectoryPage() {
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [staffToEdit, setStaffToEdit] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);

    const loadStaff = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/users/staff/');
            setStaffList(data.results || data.items || data);
        } catch (error) {
            console.error("Failed to load staff:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadStaff(); }, []);

    const handleAddClick = () => {
        setStaffToEdit(null); 
        setIsFormOpen(true);
    };

    const handleEditClick = (staff) => {
        setStaffToEdit(staff); 
        setIsFormOpen(true);
    };

    const handleDeleteClick = (staff) => {
        setStaffToDelete(staff);
        setIsDeleteOpen(true);
    };

    // Table Configuration
    const tableColumns = [
        { 
            key: 'staff_no', label: 'Staff ID',
            render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{val}</span> 
        },
        { 
            key: 'name', label: 'Full Name',
            render: (val, row) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span>
        },
        { 
            key: 'position', label: 'Role',
            render: (val) => {
                const colors = {
                    'Manager': 'bg-green-100 text-green-800',
                    'Supervisor': 'bg-blue-100 text-blue-800',
                    'Secretary': 'bg-orange-100 text-orange-800',
                    'Staff': 'bg-gray-100 text-gray-800'
                };
                return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[val] || colors['Staff']}`}>{val}</span>;
            }
        },
        { 
            key: 'branch', label: 'Branch',
            render: (val) => val ? (typeof val === 'object' ? val.city : val) : 'Unassigned'
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
        <div className=" w-full max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage DreamHome employees, roles, and kinship profiles.</p>
                </div>
                <button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
                    + Enroll Staff
                </button>
            </div>

            <DataTable 
                columns={tableColumns} 
                data={staffList} 
                keyField="staff_no"
                isLoading={isLoading}
                actions={renderActions}
            />

            <StaffFormModal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSuccess={loadStaff} 
                staffToEdit={staffToEdit} 
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={loadStaff}
                endpoint="/users/staff"
                idToDelete={staffToDelete?.staff_no}
                itemName={`${staffToDelete?.first_name} ${staffToDelete?.last_name} (${staffToDelete?.staff_no})`}
            />
        </div>
    );
}