"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function EnrollStaffPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);

    const handleSuccess = () => {
        setSubmitted(true);
        // Redirect to staff directory after 2 seconds
        setTimeout(() => router.push('/Pages/Admin/Staff'), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight">
                    Enroll New Staff
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                    Register a new employee into the DreamHome Management System.
                </p>
            </div>

            {/* Success message */}
            {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4">
                    ✅ Staff member enrolled successfully! Redirecting to Staff Directory...
                </div>
            )}

            {/* Use the real StaffFormModal — always open, no close button needed */}
            <StaffFormModal
                isOpen={true}
                onClose={() => router.push('/Pages/Admin/Staff')}
                onSuccess={handleSuccess}
                staffToEdit={null}
            />
        </div>
    );
}