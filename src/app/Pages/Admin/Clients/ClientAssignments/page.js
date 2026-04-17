'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FormField from '@/components/ui/FormField';
import Button from '@components/ui/Button';
import ClientAssignmentModal from '@/components/ui/ClientAssignmentModal';
import apiClient from '@/lib/apiClient';
import { useForm } from '@/hooks/useForm';

const normalizeList = (data) => data?.results || data?.items || data || [];

const toId = (value, idField) => {
    if (!value) return '';
    if (typeof value === 'object') return value[idField] || '';
    return value;
};

const getClientName = (client) => {
    if (!client) return 'Unknown Client';
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.client_no;
};

const getAssignedStaffLabel = (assignedStaff) => {
    if (!assignedStaff) return 'Unassigned';
    if (typeof assignedStaff === 'object') {
        const fullName = `${assignedStaff.first_name || ''} ${assignedStaff.last_name || ''}`.trim();
        return `${fullName || assignedStaff.staff_no} (${assignedStaff.staff_no})`;
    }
    return assignedStaff;
};

const roleBadgeStyles = {
    renter: 'bg-blue-100 text-blue-800',
    owner: 'bg-orange-100 text-orange-800'
};

export default function ClientAssignmentsPage() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const { formData, handleChange, reset } = useForm({ role_filter: 'all' }, {});

    const loadClients = async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const data = await apiClient('/users/clients/');
            setClients(normalizeList(data));
        } catch (error) {
            console.error('Failed to load clients for assignments:', error);
            setLoadError('Unable to load client relationships right now.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const filteredClients = useMemo(() => {
        const selectedRole = String(formData.role_filter || 'all').toLowerCase();
        if (selectedRole === 'all') return clients;

        return clients.filter((client) => String(client.role || '').toLowerCase() === selectedRole);
    }, [clients, formData.role_filter]);

    const summary = useMemo(() => {
        const renters = clients.filter((client) => String(client.role || '').toLowerCase() === 'renter').length;
        const owners = clients.filter((client) => String(client.role || '').toLowerCase() === 'owner').length;
        const assigned = clients.filter((client) => Boolean(toId(client.assigned_staff, 'staff_no'))).length;

        return {
            total: clients.length,
            renters,
            owners,
            assigned,
            unassigned: clients.length - assigned
        };
    }, [clients]);

    const openAssignmentModal = (client = selectedClient) => {
        if (!client) return;
        setSelectedClient(client);
        setIsAssignmentModalOpen(true);
    };

    const closeAssignmentModal = () => {
        setIsAssignmentModalOpen(false);
    };

    const tableColumns = [
        {
            key: 'client_no',
            label: 'Client ID',
            render: (value) => (
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">
                    {value}
                </span>
            )
        },
        {
            key: 'client_name',
            label: 'Client',
            render: (_, row) => (
                <div>
                    <p className="font-semibold text-gray-900">{getClientName(row)}</p>
                    <p className="text-xs text-gray-500">{row.email || 'No email on file'}</p>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => {
                const normalizedRole = String(value || '').toLowerCase();
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleBadgeStyles[normalizedRole] || 'bg-gray-100 text-gray-700'}`}>
                        {value || 'N/A'}
                    </span>
                );
            }
        },
        {
            key: 'telephone_no',
            label: 'Telephone',
            render: (value) => value || 'N/A'
        },
        {
            key: 'assigned_staff',
            label: 'Assigned Staff',
            render: (value) => {
                const label = getAssignedStaffLabel(value);
                const isAssigned = label !== 'Unassigned';
                return (
                    <span className={isAssigned ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}>
                        {label}
                    </span>
                );
            }
        }
    ];

    const renderActions = (row) => {
        const isAssigned = Boolean(toId(row.assigned_staff, 'staff_no'));

        return (
            <Button
                variant={isAssigned ? 'secondary' : 'primary'}
                size="sm"
                onClick={(event) => {
                    event.stopPropagation();
                    openAssignmentModal(row);
                }}
            >
                {isAssigned ? 'Reassign Staff' : 'Assign Staff'}
            </Button>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Client Relations Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Assign specific staff relationship managers to renters and owners.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadClients}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={() => openAssignmentModal()} disabled={!selectedClient}>
                        Assign Staff
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Renters</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{summary.renters}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Owners</p>
                    <p className="text-2xl font-bold text-orange-700 mt-1">{summary.owners}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Assigned</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{summary.assigned}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Unassigned</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{summary.unassigned}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="w-full sm:w-64">
                    <FormField
                        label="Role Filter"
                        field="role_filter"
                        type="select"
                        value={formData.role_filter}
                        onChange={handleChange}
                        required={false}
                    >
                        <option value="all">All Clients</option>
                        <option value="renter">Renters</option>
                        <option value="owner">Owners</option>
                    </FormField>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reset({ role_filter: 'all' })}
                        disabled={formData.role_filter === 'all'}
                    >
                        Reset Filter
                    </Button>
                </div>
            </div>

            {selectedClient && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3 text-sm">
                    Selected Client: <strong>{getClientName(selectedClient)}</strong> ({selectedClient.client_no})
                </div>
            )}

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {loadError}
                </div>
            )}

            <DataTable
                columns={tableColumns}
                data={filteredClients}
                keyField="client_no"
                isLoading={isLoading}
                emptyMessage="No clients found for the selected role filter."
                onRowClick={setSelectedClient}
                actions={renderActions}
            />

            <ClientAssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={closeAssignmentModal}
                onSuccess={loadClients}
                clientToAssign={selectedClient}
            />
        </div>
    );
}