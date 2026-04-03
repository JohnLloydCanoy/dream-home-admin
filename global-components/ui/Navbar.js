'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ManagementNavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

    const isActive = (path) => pathname === path;

    useEffect(() => {
        let isMounted = true;

        async function loadAdminUser() {
            // Get the token we saved in authService.js
            const token = localStorage.getItem('adminAccessToken');
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

            if (!token) {
                setIsLoadingAdmin(false);
                return;
            }

            try {
                // Fetch from your Django "me" endpoint (requires the Bearer Token)
                const response = await fetch(`${API_BASE_URL}/users/me/`, { 
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store' 
                });

                if (!response.ok) {
                    throw new Error('Failed to load admin profile');
                }

                const data = await response.json();

                if (isMounted) {
                    // Expecting Django to return { fullName: "...", role: "...", branchCode: "..." }
                    setAdminUser(data.user ?? data); 
                }
            } catch (error) {
                console.error("Profile Load Error:", error);
                if (isMounted) setAdminUser(null);
            } finally {
                if (isMounted) setIsLoadingAdmin(false);
            }
        }

        loadAdminUser();

        return () => { isMounted = false; };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        router.push('/'); // Redirect back to login page
    };

    const menuData = [
        { title: 'Branch & Staff', href: '/Pages/Admin/Staff', items: ['Manage Staff', 'Add New Staff'] },
        { title: 'Properties', href: '/Pages/Admin/Properties', items: ['All Properties', 'Add Property'] },
        { title: 'Renters', href: '/Pages/Admin/Renters', items: ['View Renters', 'Requirements'] },
        { title: 'Leases', href: '/Pages/Admin/Leases', items: ['Active Leases', 'New Lease'] }
    ];

    return (
        <nav className="bg-[#002147] text-white border-b border-blue-900 shadow-md sticky top-0 z-50 font-sans">
            <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
                
                {/* LOGO SECTION */}
                <Link href="/Pages/Admin" className="flex items-center gap-3 shrink-0">
                    <div className="p-1 rounded-md">
                        {/* Ensure your logo is in public/logo.png */}
                        <img src="/logo.png" alt="DH" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold leading-tight tracking-tight">DreamHome</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-semibold">Management System</span>
                    </div>
                </Link>

                {/* NAVIGATION */}
                <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                    <Link 
                        href="/Pages/Admin" 
                        className={`text-sm font-medium transition-colors hover:text-blue-300 ${isActive('/Pages/Admin') ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : 'text-white/90'}`}
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

                            <div className={`absolute top-full left-0 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 border border-gray-200 transition-all duration-200 z-[60] ${activeDropdown === menu.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                {menu.items.map((item) => (
                                    <Link 
                                        key={item} 
                                        href={`${menu.href}`} 
                                        className="block px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-[#002147] transition-colors"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* STAFF PROFILE SECTION */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden xl:flex flex-col items-end mr-2 text-right">
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                            {isLoadingAdmin ? 'Loading profile...' : (adminUser?.fullName || 'Admin User')}
                        </span>
                        <span className="text-[10px] text-blue-300 uppercase font-semibold">
                            {adminUser ? `${adminUser.role} • ${adminUser.branchCode}` : 'Authorized Access'}
                        </span>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default ManagementNavBar;