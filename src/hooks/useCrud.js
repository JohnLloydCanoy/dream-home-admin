'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient'; // Adjust path if needed

/**
 * Hook for POST requests (Adding new records)
 * @param {string} endpoint - The API endpoint (e.g., '/branches/')
 */
export function useCreate(endpoint) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRecord = async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient(endpoint, {
                method: 'POST',
                body: payload,
            });
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { createRecord, isLoading, error, setError };
}

/**
 * Hook for PUT/PATCH requests (Editing existing records)
 * @param {string} baseEndpoint - The base API endpoint (e.g., '/branches')
 */
export function useUpdate(baseEndpoint) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRecord = async (id, payload, method = 'PUT') => {
        setIsLoading(true);
        setError(null);
        try {
            // Automatically appends the ID to match Django's URL pattern
            const safeEndpoint = baseEndpoint.endsWith('/') ? baseEndpoint : `${baseEndpoint}/`;
            const data = await apiClient(`${safeEndpoint}${id}/`, {
                method: method, // Defaults to PUT, but allows PATCH
                body: payload,
            });
            return { success: true, data };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { updateRecord, isLoading, error, setError };
}

/**
 * Hook for DELETE requests (Removing records)
 * @param {string} baseEndpoint - The base API endpoint (e.g., '/branches')
 */
export function useDelete(baseEndpoint) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRecord = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const safeEndpoint = baseEndpoint.endsWith('/') ? baseEndpoint : `${baseEndpoint}/`;
            await apiClient(`${safeEndpoint}${id}/`, {
                method: 'DELETE',
            });
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteRecord, isLoading, error, setError };
}