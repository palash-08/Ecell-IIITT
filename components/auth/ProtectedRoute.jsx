'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, roles = [] }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (roles.length > 0 && !roles.includes(user.role)) {
                router.push('/');
            }
        }
    }, [user, loading, router, roles]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;
    if (roles.length > 0 && !roles.includes(user.role)) return null;

    return children;
}
