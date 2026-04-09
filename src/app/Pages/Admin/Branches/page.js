"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import apiClient from '@/lib/apiClient';
import AddBranchModal from '../../../../hooks/editHooks/AddBranchModal';
import EditBranchModal from '../../../../hooks/editHooks/EditBranchModal';
import DeleteBranchModal from '../../../../hooks/editHooks/DeleteBranchModal';

export default function BranchOverviewPage() {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const fetchBranches = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient('/branches/');
            setBranches(data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // ── Modal handlers ───────────────────────────────────────────────
    const handleAddSuccess = () => {
        setIsAddModalOpen(false);
        fetchBranches();
    };

    const handleEditClick = (branch) => {
        setSelectedBranch(branch);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedBranch(null);
        fetchBranches();
    };

    const handleDeleteClick = (branch) => {
        setSelectedBranch(branch);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalOpen(false);
        setSelectedBranch(null);
        fetchBranches();
    };

    return (
        <div className="space-y-6 relative">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#002147]">Branch Overview</h1>
                    <p className="text-gray-600 mt-1">Real-time data from the DreamHome database.</p>
                </div>

                <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
                    + Add Branch
                </Button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500 font-bold">Loading branches...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                                <th className="px-6 py-4">No.</th>
                                <th className="px-6 py-4">Address (Street & Area)</th>
                                <th className="px-6 py-4">City / Postal Code</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {branches.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-6 text-gray-400">No branches found.</td></tr>
                            ) : branches.map((branch) => (
                                <tr key={branch.branch_no} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-blue-600">{branch.branch_no}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-bold text-[#002147]">{branch.street}</div>
                                        <div className="text-gray-500">{branch.area || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-800">{branch.city}</div>
                                        <div className="text-gray-400">{branch.postcode}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div>📞 {branch.telephone_no}</div>
                                        {branch.fax_no && <div className="text-[10px] text-gray-400 mt-1">FAX: {branch.fax_no}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEditClick(branch)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit branch"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(branch)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete branch"
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
                )}
            </div>

            {/* ── Modals ──────────────────────────────────────────────────── */}
            <AddBranchModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {selectedBranch && (
                <>
                    <EditBranchModal
                        isOpen={isEditModalOpen}
                        onClose={() => { setIsEditModalOpen(false); setSelectedBranch(null); }}
                        onSuccess={handleEditSuccess}
                        branch={selectedBranch}
                    />

                    <DeleteBranchModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => { setIsDeleteModalOpen(false); setSelectedBranch(null); }}
                        onSuccess={handleDeleteSuccess}
                        branch={selectedBranch}
                    />
                </>
            )}
        </div>
    );
}
