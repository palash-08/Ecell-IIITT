'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import AddAdminForm from '@/components/admin/manage-admins/AddAdminForm';
import AdminList from '@/components/admin/manage-admins/AdminList';

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/auth/admins');
            setAdmins(res.data.data);
        } catch (err) {
            console.error('Error fetching admins:', err);
        }
    };

    const fetchTeam = async () => {
        try {
            const res = await api.get('/team');
            setTeamMembers(res.data.data);
        } catch (err) {
            console.error('Error fetching team:', err);
        }
    };

    useEffect(() => {
        if (user?.role === 'super-admin') {
            const loadData = async () => {
                setLoading(true);
                await Promise.all([fetchAdmins(), fetchTeam()]);
                setLoading(false);
            };
            loadData();
        }
    }, [user]);

    if (user?.role !== 'super-admin') {
        return <div className="p-10 text-center">Unauthorized. Super Admin access only.</div>;
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-black mb-2">Manage <span className="text-red-600">Admins.</span></h1>
                    <p className="text-gray-500 font-medium">Add, update, or remove administrative privileges.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1">
                    <AddAdminForm teamMembers={teamMembers} fetchAdmins={fetchAdmins} />
                </div>

                <div className="lg:col-span-2">
                    <AdminList admins={admins} loading={loading} user={user} fetchAdmins={fetchAdmins} />
                </div>
            </div>
        </div>
    );
}
