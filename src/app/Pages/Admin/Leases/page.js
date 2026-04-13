'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import LeaseFormModal from '@/components/ui/LeaseFormModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import apiClient from '@/lib/apiClient';

const formatCurrency = (value) => {
	const amount = Number(value);
	if (Number.isNaN(amount)) return value;
	return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (value) => {
	if (!value) return 'N/A';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function LeaseAgreementsPage() {
	// Data State
	const [leases, setLeases] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Modal States
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [leaseToEdit, setLeaseToEdit] = useState(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [leaseToDelete, setLeaseToDelete] = useState(null);

	const loadLeases = async () => {
		setIsLoading(true);
		try {
			const data = await apiClient('/leases/');
			setLeases(data.results || data.items || data);
		} catch (error) {
			console.error('Failed to load leases:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => { loadLeases(); }, []);

	const handleAddClick = () => {
		setLeaseToEdit(null);
		setIsFormOpen(true);
	};

	const handleEditClick = (lease) => {
		setLeaseToEdit(lease);
		setIsFormOpen(true);
	};

	const handleDeleteClick = (lease) => {
		setLeaseToDelete(lease);
		setIsDeleteOpen(true);
	};

	const tableColumns = [
		{
			key: 'lease_no',
			label: 'Lease ID',
			render: (val) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{val}</span>
		},
		{
			key: 'property',
			label: 'Property',
			render: (val) => <span className="font-medium text-gray-900">{val}</span>
		},
		{
			key: 'renter',
			label: 'Renter',
			render: (val) => <span className="text-gray-700">{val}</span>
		},
		{
			key: 'period',
			label: 'Lease Period',
			render: (val, row) => (
				<span className="text-xs text-gray-700">
					{formatDate(row.rent_start)} - {formatDate(row.rent_finish)}
				</span>
			)
		},
		{
			key: 'duration',
			label: 'Duration',
			render: (val) => `${val} month${Number(val) === 1 ? '' : 's'}`
		},
		{
			key: 'monthly_rent',
			label: 'Monthly Rent',
			render: (val) => <span className="font-medium text-gray-900">£{formatCurrency(val)}</span>
		},
		{
			key: 'deposit',
			label: 'Deposit',
			render: (val) => <span className="font-medium text-gray-900">£{formatCurrency(val)}</span>
		},
		{
			key: 'deposit_paid',
			label: 'Deposit Status',
			render: (val) => (
				<span className={`px-2 py-1 rounded-full text-xs font-bold ${val ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
					{val ? 'Paid' : 'Pending'}
				</span>
			)
		},
		{
			key: 'payment_method',
			label: 'Payment Method'
		},
		{
			key: 'staff',
			label: 'Arranged By',
			render: (val) => val || 'Unassigned'
		}
	];

	const renderActions = (row) => (
		<div className="flex justify-end gap-3">
			<button
				onClick={(e) => { e.stopPropagation(); handleEditClick(row); }}
				className="text-blue-600 hover:text-blue-900 text-sm font-semibold"
			>
				Edit
			</button>
			<button
				onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}
				className="text-red-600 hover:text-red-900 text-sm font-semibold"
			>
				Delete
			</button>
		</div>
	);

	return (
		<div className=" w-full max-w-7xl mx-auto">
			<div className="mb-8 flex justify-between items-end">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Lease Agreements</h1>
					<p className="text-sm text-gray-500 mt-1">Manage renter lease contracts, deposits, and payment terms.</p>
				</div>
				<button onClick={handleAddClick} className="bg-[#002147] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm">
					+ New Lease
				</button>
			</div>

			<DataTable
				columns={tableColumns}
				data={leases}
				keyField="lease_no"
				isLoading={isLoading}
				actions={renderActions}
			/>

			<LeaseFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={loadLeases}
				leaseToEdit={leaseToEdit}
			/>

			<ConfirmDeleteModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onSuccess={loadLeases}
				endpoint="/leases"
				idToDelete={leaseToDelete?.lease_no}
				itemName={`Lease ${leaseToDelete?.lease_no}`}
			/>
		</div>
	);
}
