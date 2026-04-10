'use client';

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import Button from '../../../../../global-components/ui/Button';
import AddStaffModal from '../../../../components/modal/AddStaffModal';
import EditStaffModal from '../../../../components/modal/EditStaffModal';
import DeleteStaffModal from '../../../../components/modal/DeleteStaffModal';

export default function StaffDirectoryPage() {
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const fetchStaff = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient('/users/staff/');
            setStaffList(data.results || data);
        } catch (err) {
            console.error('Failed to fetch staff directory:', err);
            setError('Failed to load the staff directory. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleAddSuccess = () => {
        setIsAddModalOpen(false);
        fetchStaff();
    };

    const handleEditClick = (staff) => {
        setSelectedStaff(staff);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedStaff(null);
        fetchStaff();
    };

    const handleDeleteClick = (staff) => {
        setSelectedStaff(staff);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalOpen(false);
        setSelectedStaff(null);
        fetchStaff();
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight">
                        Staff Directory
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium">
                        Manage and view all registered personnel for DreamHome.
                    </p>
                </div>
                <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
                    + Add New Staff
                </Button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 font-medium">
                        {error}
                    </div>
                ) : staffList.length === 0 ? (
                    /* Empty State */
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#002147]">No Staff Data Yet</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            The staff list will appear here once personnel are added to the system.
                        </p>
                    </div>
                ) : (
                    /* Data Table */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="p-4 pl-6">Staff No</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Position</th>
                                    <th className="p-4">Email / Phone</th>
                                    <th className="p-4">Branch</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {staffList.map((staff) => (
                                    <tr key={staff.staff_no} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 pl-6 font-medium text-[#002147]">
                                            {staff.staff_no}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">
                                                {staff.first_name} {staff.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {staff.sex === 'M' || staff.sex === 'Male' ? 'Male' : 'Female'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {staff.position}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-800">{staff.email || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{staff.telephone_no}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {/* Assuming the API returns a branch name or object. Adjust if it returns just an ID */}
                                            {typeof staff.branch === 'object' ? staff.branch?.name : staff.branch || 'Unassigned'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(staff.date_joined).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex justify-end gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleEditClick(staff)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit staff"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteClick(staff)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete staff"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddStaffModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {selectedStaff && (
                <>
                    <EditStaffModal
                        isOpen={isEditModalOpen}
                        onClose={() => { setIsEditModalOpen(false); setSelectedStaff(null); }}
                        onSuccess={handleEditSuccess}
                        staff={selectedStaff}
                    />

                    <DeleteStaffModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => { setIsDeleteModalOpen(false); setSelectedStaff(null); }}
                        onSuccess={handleDeleteSuccess}
                        staff={selectedStaff}
                    />
                </>
            )}
        </div>
    );
}