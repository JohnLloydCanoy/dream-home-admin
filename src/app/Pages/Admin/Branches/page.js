"use client";

import React, { useEffect, useState } from 'react';

export default function BranchOverviewPage() {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBranches() {
            const token = localStorage.getItem('adminAccessToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

            try {
                const response = await fetch(`${API_URL}/branches/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setBranches(data);
            } catch (err) {
                console.error("Branch Load Error:", err);
            } finally {
                setIsLoading(isMounted => setIsLoading(false));
            }
        }
        fetchBranches();
    }, []);

    if (isLoading) return <div className="p-8 text-gray-500 font-bold">Loading branches...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-[#002147]">Branch Overview</h1>
                <p className="text-gray-600 mt-1">Real-time data from the DreamHome database.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                        {branches.map((branch) => (
                            <tr key={branch.branch_no} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-bold text-blue-600">{branch.branch_no}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-bold text-[#002147]">{branch.street}</div>
                                    <div className="text-gray-500">{branch.area || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-medium text-gray-800">{branch.city}</div>
                                    <div className="text-gray-400">{branch.postcode}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div>📞 {branch.telephone_no}</div>
                                    {branch.fax_no && <div className="text-[10px] text-gray-400">FAX: {branch.fax_no}</div>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}