'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ManagementNavBar = () => {
const pathname = usePathname();
const [activeDropdown, setActiveDropdown] = useState(null);

const isActive = (path) => pathname === path;


const menuData = [
{
    title: 'Branch & Staff',
    href: '/management/staff',
    items: [
    'Staff Directory', 
    'Supervisor Groups', 
    'Next-of-Kin Records', 
    'Branch Offices'
    ]
},
{
    title: 'Properties',
    href: '/management/properties',
    items: [
    'Manage Listings', 
    'Inspections', 
    'Advertising', 
    'Owner Details' 
    ]
},
{
    title: 'Renters',
    href: '/management/renters',
    items: [
    'Prospective Renters',
    'Viewing Logs',
    'Viewing Comments' 
    ]
},
{
    title: 'Leases',
    href: '/management/leases',
    items: [
    'Active Agreements', 
    'Expiring Leases', 
    'Performance Tracking'
    ]
}
];

return (
        <nav className="bg-[#002147] text-white border-b border-blue-900 shadow-md sticky top-0 z-50 font-sans">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
            
            {/* LOGO SECTION */}
            <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="bg-white p-1 rounded-md">
                <img src="/DreamHomelogo.png" alt="DreamHome Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight tracking-tight">DreamHome</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-semibold">Management System</span>
            </div>
            </Link>

            {/* MANAGEMENT NAVIGATION */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-blue-300 ${isActive('/dashboard') ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : 'text-white/90'}`}
            >
                Dashboard
            </Link>

            {menuData.map((menu) => (
                <div 
                key={menu.title} 
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown(menu.title)}
                onMouseLeave={() => setActiveDropdown(null)}
                >
                <div className="flex items-center gap-1 cursor-pointer text-sm font-medium transition-colors hover:text-blue-300">
                    {menu.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${activeDropdown === menu.title ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* DROPDOWN MENU */}
                <div className={`absolute top-full left-0 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 border border-gray-200 transition-all duration-200 z-[60] ${activeDropdown === menu.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    {menu.items.map((item) => (
                    <Link 
                        key={item} 
                        href={`${menu.href}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-[#002147] transition-colors"
                    >
                        {item}
                    </Link>
                    ))}
                </div>
                </div>
            ))}
            </div>

            {/* STAFF ACTIONS */}
            <div className="flex items-center gap-4 shrink-0">
            <div className="hidden xl:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-white">John White</span>
                <span className="text-[10px] text-blue-300">Branch Manager (B85)</span>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition">
                Sign Out
            </button>
            </div>

        </div>
        </nav>
    );
};

export default ManagementNavBar;