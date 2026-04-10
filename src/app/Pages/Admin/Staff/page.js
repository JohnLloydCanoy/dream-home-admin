import React from 'react';

export default function StaffDirectoryPage() {
    return (
        <div className="p-8 w-full">
            
            {/*  CHANGE TITLE AND DESCRIPTION HERE --- */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and view details for Staff Directory.</p>
            </div>

            {/* --- Placeholder Content Card --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                
                {/* Construction Icon */}
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Under Development</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    This section of the DreamHome Admin Portal is currently being built. Future components, tables, and logic will be implemented here.
                </p>
            </div>

        </div>
    );
}