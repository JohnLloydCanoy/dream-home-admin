"use client";

import React, { useState } from 'react';

export default function EnrollStaffPage() {
    const [formData, setFormData] = useState({
        staffNo: '',
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        branch: '',
        salary: '',
        sex: 'M',
        dob: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enrolling Staff:", formData);
        // Logic to POST to your Django /api/staff/enroll/ endpoint goes here
        alert("Enrollment submitted! (Placeholder)");
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

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-sm font-bold text-[#002147] uppercase tracking-wider">
                        Personnel Details
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Row 1: Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">First Name</label>
                            <input 
                                type="text" name="firstName" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Last Name</label>
                            <input 
                                type="text" name="lastName" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Row 2: Email & Staff No */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                            <input 
                                type="email" name="email" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="staff@dreamhome.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Staff Number</label>
                            <input 
                                type="text" name="staffNo" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="e.g. S0092"
                            />
                        </div>
                    </div>

                    {/* Row 3: Position & Branch */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Position</label>
                            <select 
                                name="position" onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Position</option>
                                <option value="Manager">Manager</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Assistant">Assistant</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Assigned Branch</label>
                            <select 
                                name="branch" onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select Branch</option>
                                <option value="B001">B001 - London</option>
                                <option value="B002">B002 - Glasgow</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Monthly Salary</label>
                            <input 
                                type="number" name="salary" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Row 4: Gender & DOB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Gender</label>
                            <div className="flex gap-4 p-1">
                                {['M', 'F', 'O'].map((g) => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" name="sex" value={g} 
                                            checked={formData.sex === g}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-600">{g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase">Date of Birth</label>
                            <input 
                                type="date" name="dob" required
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-50">
                        <button 
                            type="submit"
                            className="bg-[#002147] hover:bg-[#001833] text-white px-10 py-3 rounded-lg font-bold text-lg shadow-lg active:scale-95 transition-all"
                        >
                            Complete Enrollment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}