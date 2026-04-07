'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

const StaffSideBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState(null);
    const [staffUser, setStaffUser] = useState(null);
    const [isLoadingStaff, setIsLoadingStaff] = useState(true);

    const isActive = (path) => pathname === path;

    // Load staff profile data on mount securely and cleanly
    useEffect(() => {
        let isMounted = true;

        async function loadStaffUser() {
            try {
                // Assuming standard endpoint for fetching current user profile
                const data = await apiClient('/users/me/');
                if (isMounted) {
                    setStaffUser(data.user ?? data); 
                }
            } catch (error) {
                console.error("Profile Load Error:", error);
                if (isMounted) setStaffUser(null);
            } finally {
                if (isMounted) setIsLoadingStaff(false);
            }
        }

        loadStaffUser();

        return () => { isMounted = false; };
    }, []);

    const handleSignOut = () => {
        // Adjust these keys if your app uses a unified 'accessToken' instead
        localStorage.removeItem('staffAccessToken');
        localStorage.removeItem('staffRefreshToken');
        router.push('/'); 
    };

    const toggleMenu = (title) => {
        setActiveMenu(activeMenu === title ? null : title);
    };

    // Context-specific menu routing for Staff operations
    const menuData = [
        { 
            title: 'Properties', 
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            items: [
                { label: 'Browse Listings', href: '/Pages/Staff/Properties' },
                { label: 'My Assigned', href: '/Pages/Staff/Properties/Assigned' }
            ] 
        },
        { 
            title: 'My Tasks', 
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            items: [
                { label: 'Active Tasks', href: '/Pages/Staff/Tasks' },
                { label: 'Completed Tasks', href: '/Pages/Staff/Tasks/History' }
            ] 
        },
        { 
            title: 'Clients', 
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            items: [
                { label: 'My Leads', href: '/Pages/Staff/Clients' },
                { label: 'Appointments', href: '/Pages/Staff/Appointments' }
            ] 
        }
    ];

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-[#002147] text-white border-r border-blue-900 shadow-xl flex flex-col font-sans z-50">
            
            {/* LOGO SECTION */}
            <div className="p-6 border-b border-blue-900 flex items-center gap-3 shrink-0">
                <div className="p-1 bg-white/5 rounded-md">
                    <img src="/logo.png" alt="DH" className="h-10 w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight tracking-tight">DreamHome</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-blue-300 font-semibold">Staff Portal</span>
                </div>
            </div>

            {/* NAVIGATION SECTION */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                
                {/* Standalone Dashboard Link */}
                <Link 
                    href="/Pages/Staff" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/Pages/Staff') ? 'bg-blue-600/20 text-blue-300' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    My Workspace
                </Link>

                <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold text-blue-400/60 uppercase tracking-wider">Operations</p>
                </div>

                {/* Accordion Menus */}
                {menuData.map((menu) => (
                    <div key={menu.title} className="mb-1">
                        <button 
                            onClick={() => toggleMenu(menu.title)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === menu.title ? 'bg-white/5 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} />
                                </svg>
                                {menu.title}
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${activeMenu === menu.title ? 'rotate-180 text-blue-300' : 'opacity-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Collapsible Sub-items */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeMenu === menu.title ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-11 pr-3 py-1 space-y-1 border-l border-blue-800 ml-5 my-1">
                                {menu.items.map((item) => (
                                    <Link 
                                        key={item.label} 
                                        href={item.href} 
                                        className={`block px-2 py-1.5 text-xs font-medium rounded transition-colors ${isActive(item.href) ? 'text-blue-300 bg-blue-900/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM PROFILE SECTION */}
            <div className="p-4 border-t border-blue-900 bg-[#001833] shrink-0">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 border border-blue-400">
                            {isLoadingStaff ? '...' : (staffUser?.fullName?.charAt(0) || 'S')}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">
                                {isLoadingStaff ? 'Loading...' : (staffUser?.fullName || 'Staff Member')}
                            </span>
                            <span className="text-[10px] text-blue-300 uppercase font-semibold truncate">
                                {staffUser ? `${staffUser.role || 'Staff'} • ${staffUser.branchCode || 'HQ'}` : 'Authorized Access'}
                            </span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold py-2 rounded-lg transition-colors border border-red-600/20 hover:border-red-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>

        </aside>
    );
};

export default StaffSideBar;