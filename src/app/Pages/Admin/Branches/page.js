"use client";

import React, { useEffect, useState } from 'react';
import Dialog from './AddBranchModal';
import Button from '../../../../../global-components/ui/Button';

export default function BranchOverviewPage() {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        street: '',
        area: '',
        city: '',
        postcode: '',
        telephone_no: '',
        fax_no: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // --- Fetch Branches (GET) ---
    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_URL}/branches/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_URL}/branches/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }


            setIsAddModalOpen(false);
            setFormData({ street: '', area: '', city: '', postcode: '', telephone_no: '', fax_no: '' });
            fetchBranches(); 

        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to add branch. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#002147]">Branch Overview</h1>
                    <p className="text-gray-600 mt-1">Real-time data from the DreamHome database.</p>
                </div>
                
                {/* Trigger Button */}
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
                                <th className="px-6 py-4">City / Postcode</th>
                                <th className="px-6 py-4">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {branches.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-6 text-gray-400">No branches found.</td></tr>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* THE DIALOG COMPONENT */}
            <Dialog 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                title="Register New Branch"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Street Address <span className="text-red-500">*</span></label>
                        <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="123 Main St" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Area</label>
                        <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Downtown (Optional)" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="London" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Postcode <span className="text-red-500">*</span></label>
                            <input type="text" name="postcode" required value={formData.postcode} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="SW1A 1AA" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Telephone <span className="text-red-500">*</span></label>
                            <input type="text" name="telephone_no" required value={formData.telephone_no} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="+44 20..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Fax No</label>
                            <input type="text" name="fax_no" value={formData.fax_no} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="(Optional)" />
                        </div>
                    </div>

                    {/* Dialog Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            Save Branch
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}