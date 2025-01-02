import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, AlertCircle } from 'lucide-react';
import { getUsers, createUser, deleteUser, toggleUserRole } from '../../lib/users';

interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => { loadUsers(); }, []);
  
  async function loadUsers() {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await createUser(newUserEmail, newUserPassword);
      setNewUserEmail('');
      setNewUserPassword('');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  async function handleToggleRole(userId: string, currentRole: string) {
    try {
      await toggleUserRole(userId, currentRole === 'admin' ? 'user' : 'admin');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        User Management
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-200 mt-0.5 mr-2" />
          <span className="text-red-700 dark:text-red-200">{error}</span>
        </div>
      )}

      <form onSubmit={handleCreateUser} className="mb-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Email address"
            required
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <input
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            placeholder="Password"
            required
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleRole(user.id, user.role || 'user')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                    title={user.role === 'admin' ? 'Remove admin role' : 'Make admin'}
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
