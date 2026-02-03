"use client";

import { useState } from "react";
import { updateUserRole, deleteUser, createUser } from "@/app/lib/actions/users";
import { Button } from "@/app/components/ui/Button";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { Trash2, UserPlus } from "lucide-react";

type User = {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    created_at: string;
};

export default function UsersList({ users }: { users: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'patient' as 'admin' | 'psychologist' | 'patient'
    });

    const handleRoleChange = async (userId: string, newRole: string) => {
        // Confirmation
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setLoadingId(userId);
        try {
            await updateUserRole(userId, newRole as 'admin' | 'psychologist' | 'patient');
        } catch (error) {
            alert("Failed to update role");
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        setLoadingId(userId);
        try {
            await deleteUser(userId);
        } catch (error) {
            alert("Failed to delete user");
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await createUser(newUser);
            setIsAddUserOpen(false);
            setNewUser({ email: '', password: '', fullName: '', role: 'patient' });
            alert("User created successfully");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to create user");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setIsAddUserOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{user.full_name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                user.role === 'psychologist' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <select
                                            disabled={loadingId === user.id}
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                            style={{ color: 'white' }}
                                        >
                                            <option value="patient">Patient</option>
                                            <option value="psychologist">Psychologist</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={loadingId === user.id}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Create New User">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            required
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            required
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            required
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Min 6 characters"
                            minLength={6}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                        >
                            <option value="patient">Patient</option>
                            <option value="psychologist">Psychologist</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
