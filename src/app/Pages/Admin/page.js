"use client";

import ManagementNavBar from "./components/ui/Navbar";

export default function AdminPage() {
    return (
        <div className="flex bg-[#f0f2f5] min-h-screen font-sans">
            {/* Sidebar */}
            <ManagementNavBar />

            {/* Main Content Area - offset by the sidebar width (w-64 = ml-64) */}
            <div className="ml-64 flex-1 p-8">
                
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium">
                        Welcome to the DreamHome Admin Portal. Here's what's happening today.
                    </p>
                </div>

                {/* KPI Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    
                    {/* Card 1 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Properties</p>
                                <h3 className="text-3xl font-bold text-[#002147] mt-2">142</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-emerald-600 font-medium mt-4">↑ 12 new this month</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Staff</p>
                                <h3 className="text-3xl font-bold text-[#002147] mt-2">28</h3>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mt-4">Across 4 branches</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Leases</p>
                                <h3 className="text-3xl font-bold text-[#002147] mt-2">89</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-amber-500 font-medium mt-4">5 expiring soon</p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Tasks</p>
                                <h3 className="text-3xl font-bold text-[#E11553] mt-2">14</h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg text-[#E11553]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-[#E11553] font-medium mt-4">Needs attention</p>
                    </div>

                </div>

                {/* Lower Section Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Placeholder for Chart/Graph */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Monthly Revenue Overview</h2>
                            <button className="text-sm text-blue-600 font-semibold hover:underline">View Report</button>
                        </div>
                        <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <p className="text-gray-400 font-medium">Chart Visualization Area (e.g., Recharts or Chart.js)</p>
                        </div>
                    </div>

                    {/* Placeholder for Recent Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">New lease agreement signed</p>
                                        <p className="text-xs text-gray-500">Property #P00{item} • 2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-200">
                            View All Activity
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}