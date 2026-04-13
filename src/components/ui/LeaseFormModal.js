"use client";

import React, { useEffect, useState } from 'react';
import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import FormField from '@/components/ui/FormField';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';
import { useCreate, useUpdate } from '@/hooks/useCrud';
import { leaseValidators } from '@/lib/validator';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
	if (!value) return '';
	if (typeof value === 'object') return value[idField] || '';
	return value;
};

const getInitialState = (lease = null) => ({
	property: toId(lease?.property, 'property_no'),
	renter: toId(lease?.renter, 'client_no'),
	staff: toId(lease?.staff, 'staff_no'),
	rent_start: lease?.rent_start || '',
	rent_finish: lease?.rent_finish || '',
	duration: lease?.duration || '',
	monthly_rent: lease?.monthly_rent || '',
	payment_method: lease?.payment_method || '',
	deposit: lease?.deposit || '',
	deposit_paid: String(Boolean(lease?.deposit_paid))
});

export default function LeaseFormModal({ isOpen, onClose, onSuccess, leaseToEdit }) {
	const isEditMode = Boolean(leaseToEdit);

	const [properties, setProperties] = useState([]);
	const [renters, setRenters] = useState([]);
	const [leaseStaff, setLeaseStaff] = useState([]);

	const { createRecord, isLoading: isCreating, error: createError } = useCreate('/leases/');
	const { updateRecord, isLoading: isUpdating, error: updateError } = useUpdate('/leases');

	const isSaving = isCreating || isUpdating;
	const submitError = isEditMode ? updateError : createError;

	const { formData, errors, handleChange, validate, reset } = useForm(
		getInitialState(leaseToEdit),
		leaseValidators
	);

	useEffect(() => {
		if (!isOpen) return;

		const currentPropertyNo = toId(leaseToEdit?.property, 'property_no');
		const currentStaffNo = toId(leaseToEdit?.staff, 'staff_no');

		Promise.all([
			apiClient('/properties/'),
			apiClient('/users/clients/'),
			apiClient('/users/staff/')
		])
			.then(([propertiesData, clientsData, staffData]) => {
				const propertyList = normalizeList(propertiesData).filter(
					(property) => property.status === 'Available' || property.property_no === currentPropertyNo
				);

				const renterList = normalizeList(clientsData).filter(
					(client) => String(client?.role || '').toLowerCase() === 'renter'
				);

				const arrangers = normalizeList(staffData).filter((staff) => {
					const position = String(staff?.position || '').toLowerCase();
					return position === 'manager' || position === 'supervisor' || staff.staff_no === currentStaffNo;
				});

				setProperties(propertyList);
				setRenters(renterList);
				setLeaseStaff(arrangers);
			})
			.catch((error) => console.error('Failed to load lease form options:', error));
	}, [isOpen, leaseToEdit?.lease_no]);

	useEffect(() => {
		if (isOpen) {
			reset(getInitialState(leaseToEdit));
		}
	}, [leaseToEdit?.lease_no, isOpen]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		const payload = {
			...formData,
			duration: Number(formData.duration),
			staff: formData.staff || null,
			deposit_paid: formData.deposit_paid === 'true'
		};

		const result = isEditMode
			? await updateRecord(leaseToEdit.lease_no, payload)
			: await createRecord(payload);

		if (result.success) {
			onSuccess();
			onClose();
		}
	};

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title={isEditMode ? `Edit Lease ${leaseToEdit.lease_no}` : 'Add New Lease Agreement'}
		>
			<form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 pt-2 pb-6 custom-scrollbar">
				{submitError && (
					<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 sticky top-0 z-10 animate-in fade-in zoom-in duration-200">
						{submitError}
					</div>
				)}

				<section>
					<h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
						<span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
						Lease Parties
					</h3>

					<div className="space-y-5">
						<FormField
							label="Property"
							field="property"
							type="select"
							value={formData.property}
							onChange={handleChange}
							error={errors.property}
						>
							<option value="">- Select Property -</option>
							{properties.map((property) => (
								<option key={property.property_no} value={property.property_no}>
									{property.property_no} - {property.city}
								</option>
							))}
						</FormField>

						<FormField
							label="Renter"
							field="renter"
							type="select"
							value={formData.renter}
							onChange={handleChange}
							error={errors.renter}
						>
							<option value="">- Select Renter -</option>
							{renters.map((renter) => (
								<option key={renter.client_no} value={renter.client_no}>
									{renter.first_name} {renter.last_name} ({renter.client_no})
								</option>
							))}
						</FormField>

						<FormField
							label="Arranged By"
							field="staff"
							type="select"
							value={formData.staff}
							onChange={handleChange}
							required={false}
						>
							<option value="">- Unassigned -</option>
							{leaseStaff.map((staff) => (
								<option key={staff.staff_no} value={staff.staff_no}>
									{staff.first_name} {staff.last_name} ({staff.staff_no})
								</option>
							))}
						</FormField>
					</div>
				</section>

				<section>
					<h3 className="text-sm font-bold text-[#002147] border-b pb-2 mb-4 flex items-center gap-2">
						<span className="bg-[#002147] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
						Lease Terms
					</h3>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							label="Rent Start"
							field="rent_start"
							type="date"
							value={formData.rent_start}
							onChange={handleChange}
							error={errors.rent_start}
						/>

						<FormField
							label="Rent Finish"
							field="rent_finish"
							type="date"
							value={formData.rent_finish}
							onChange={handleChange}
							error={errors.rent_finish}
						/>

						<FormField
							label="Duration (Months)"
							field="duration"
							type="number"
							value={formData.duration}
							onChange={handleChange}
							error={errors.duration}
							placeholder="3 - 12"
						/>

						<FormField
							label="Monthly Rent"
							field="monthly_rent"
							type="number"
							value={formData.monthly_rent}
							onChange={handleChange}
							error={errors.monthly_rent}
							placeholder="e.g. 850"
						/>

						<FormField
							label="Deposit"
							field="deposit"
							type="number"
							value={formData.deposit}
							onChange={handleChange}
							error={errors.deposit}
							placeholder="e.g. 850"
						/>

						<FormField
							label="Payment Method"
							field="payment_method"
							value={formData.payment_method}
							onChange={handleChange}
							error={errors.payment_method}
							placeholder="e.g. Bank Transfer"
						/>

						<FormField
							label="Deposit Paid"
							field="deposit_paid"
							type="select"
							value={formData.deposit_paid}
							onChange={handleChange}
							required={false}
							className="col-span-2"
						>
							<option value="false">No</option>
							<option value="true">Yes</option>
						</FormField>
					</div>
				</section>

				<div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
					<Button variant="ghost" onClick={onClose} type="button" disabled={isSaving}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" isLoading={isSaving}>
						{isEditMode ? 'Update Lease' : 'Save Lease'}
					</Button>
				</div>
			</form>
		</Dialog>
	);
}
