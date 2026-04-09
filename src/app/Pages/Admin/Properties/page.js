'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable'; // Adjust import path as needed

export default function PropertiesPage() {
    // 1. Setup State
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch Dummy Data (Replace with your Django API later)
    useEffect(() => {
        setTimeout(() => {
            setProperties([
                { property_no: 'PG4', type: 'Flat', rent: 600, status: 'Available', city: 'Glasgow' },
                { property_no: 'PG16', type: 'House', rent: 850, status: 'Rented', city: 'Glasgow' },
                { property_no: 'PL94', type: 'Flat', rent: 400, status: 'Reserved', city: 'London' }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    // 3. Define the Columns Configuration
    const tableColumns = [
        { key: 'property_no', label: 'Property ID' },
        { key: 'city', label: 'Location' },
        { key: 'type', label: 'Type' },
        { 
            key: 'rent', 
            label: 'Monthly Rent',
            // Custom render to add the currency symbol
            render: (value) => <span className="font-medium text-gray-900">£{value}</span> 
        },
        { 
            key: 'status', 
            label: 'Status',
            // Custom render to create dynamic colored badges!
            render: (value) => {
                const colors = {
                    'Available': 'bg-green-100 text-green-800',
                    'Rented': 'bg-blue-100 text-blue-800',
                    'Reserved': 'bg-orange-100 text-orange-800'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
                        {value}
                    </span>
                );
            }
        }
    ];

    // 4. Define custom actions (Edit / Delete buttons)
    const renderActions = (row) => (
        <div className="flex justify-end gap-3">
            <button 
                onClick={(e) => { e.stopPropagation(); alert(`Edit ${row.property_no}`); }} 
                className="text-blue-600 hover:text-blue-900 text-sm font-semibold"
            >
                Edit
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); alert(`Delete ${row.property_no}`); }} 
                className="text-red-600 hover:text-red-900 text-sm font-semibold"
            >
                Delete
            </button>
        </div>
    );

    return (
        <div className="w-full">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Listings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all active and inactive properties.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    + Add Property
                </button>
            </div>

            {/* 🌟 Just plug the component in! */}
            <DataTable 
                columns={tableColumns} 
                data={properties} 
                keyField="property_no"
                isLoading={isLoading}
                actions={renderActions}
            />
        </div>
    );
}