"use client";

import React from 'react';

export default function ResourceAllocationPage() {
    const resources = [
        { id: 1, name: 'Company Vehicles', allocated: 12, total: 15, unit: 'Units' },
        { id: 2, name: 'Workstations/Laptops', allocated: 45, total: 50, unit: 'Units' },
        { id: 3, name: 'Operational Budget', allocated: 75000, total: 100000, unit: 'GBP' },
    ];

    const branchDistrubution = [
        { branch: 'B001 - London', staff: 8, vehicles: 5, laptops: 10 },
        { branch: 'B002 - Glasgow', staff: 5, vehicles: 3, laptops: 7 },
        { branch: 'B003 - Aberdeen', staff: 4, vehicles: 2, laptops: 5 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight">
                    Resource Allocation
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                    Monitor and distribute company assets across all DreamHome branches.
                </p>
            </div>

            {/* Global Resource Capacity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {resources.map((res) => {
                    const percentage = (res.allocated / res.total) * 100;
                    return (
                        <div key={res.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-500 uppercase">{res.name}</span>
                                <span className="text-xs font-bold text-blue-600">{Math.round(percentage)}% Used</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 transition-all duration-500" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-gray-400">
                                    <span>{res.allocated} {res.unit} Allocated</span>
                                    <span>{res.total} Total</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Distribution Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#002147]">Branch Asset Breakdown</h2>
                    <button className="bg-[#002147] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#001833] transition">
                        Reallocate Assets
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Branch Location</th>
                                <th className="px-6 py-4">On-site Staff</th>
                                <th className="px-6 py-4">Vehicles</th>
                                <th className="px-6 py-4">Laptops</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {branchDistrubution.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-[#002147] text-sm">{item.branch}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.staff}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.vehicles}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.laptops}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">
                                            Optimal
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Placeholder for Resource Request Logic */}
            <div className="p-8 bg-blue-900/5 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-9-4.512a11.95 11.95 0 0112-2.944 11.95 11.95 0 0112 2.944M12 2.944v2.126m0 0a12.974 12.974 0 010 18.004m0-18.004a12.974 12.974 0 000 18.004m0 0v2.126" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-[#002147]">Inventory Management</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        This section will eventually link to your Assets database to track real-time inventory levels across the UK.
                    </p>
                </div>
            </div>
        </div>
    );
}