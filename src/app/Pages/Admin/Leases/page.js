'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import apiClient from '@/lib/apiClient'; 

export default function LeasesPage() {
    const [leases, setLeases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLeases = async () => {
            try {
                const data = await apiClient('/leases/'); 
                if (isMounted) {
                    setLeases(data.items || data); 
                }
            } catch (error) {
                console.error("Failed to load leases:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchLeases();
        return () => { isMounted = false; };
    }, []);

    const tableColumns = [
        { 
            key: 'lease_no', 
            label: 'Lease No.',
            render: (value) => <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{value}</span> 
        },
        { key: 'property_id', label: 'Property' },
        { key: 'renter_name', label: 'Renter' },
        { 
            key: 'duration', 
            label: 'Duration',
            render: (value) => `${value} Months`
        },
        { 
            key: 'monthly_rent', 
            label: 'Monthly Rent',
            render: (value) => <span className="font-medium">£{value}</span> 
        },
        { 
            key: 'deposit_paid', 
            label: 'Deposit Status',
            // Dynamic badge based on the boolean value!
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? 'Paid' : 'Pending'}
                </span>
            )
        }
    ];

    const renderActions = (row) => (
        <div className="flex justify-end gap-3">
            <button className="text-blue-600 hover:text-blue-900 text-sm font-semibold transition-colors">
                View Contract
            </button>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lease Agreements</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage active, pending, and expired lease contracts.</p>
                </div>
                
                <button className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Lease
                </button>
            </div>

            <DataTable 
                columns={tableColumns} 
                data={leases} 
                keyField="lease_no"
                isLoading={isLoading}
                actions={renderActions}
                emptyMessage="No lease agreements found."
            />
        </div>
    );
}