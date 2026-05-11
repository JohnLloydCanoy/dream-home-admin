'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/lib/apiClient';

// ─── Context ─────────────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * Reads role and first_name directly from the stored JWT (no network call).
 */
function decodeToken() {
    try {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem('adminAccessToken');
        if (!token) return null;
        const decoded = jwtDecode(token);
        return {
            role: decoded.role || null,
            firstName: decoded.first_name || null,
        };
    } catch {
        return null;
    }
}

/**
 * AuthProvider — wraps the app and provides user identity + branch info
 * to every page via useAuth().
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // full profile from /users/me/
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            try {
                const data = await apiClient('/users/me/');
                const profile = data.user ?? data;
                if (isMounted) setUser(profile);
            } catch (err) {
                console.error('AuthProvider: failed to load profile', err);
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        // Quick synchronous read from JWT
        const tokenData = decodeToken();
        if (!tokenData) {
            setIsLoading(false);
            return;
        }

        loadProfile();
        return () => { isMounted = false; };
    }, []);

    const value = {
        user,
        isLoading,
        /** "ADMIN" | "Manager" | "Supervisor" | "Staff" | "Secretary" */
        role: user?.role || decodeToken()?.role || null,
        /** The branch_no string the logged-in staff belongs to, e.g. "B001" */
        branchCode: user?.branchCode || null,
        /** Staff number, e.g. "S001" */
        staffNo: user?.staff_no || null,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth() — consume identity anywhere.
 *
 * Usage:
 *   const { role, branchCode, staffNo, user } = useAuth();
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        // Graceful fallback when used outside provider (e.g. in tests)
        const tokenData = decodeToken();
        return {
            user: null,
            isLoading: true,
            role: tokenData?.role || null,
            branchCode: null,
            staffNo: null,
        };
    }
    return ctx;
}
