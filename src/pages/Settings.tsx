import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminGuard } from '../components/AdminGuard';
import { UserManagement } from './settings/UserManagement';
import { useAdminCheck } from '../hooks/useAdminCheck';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'users'>('general');
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-6 w-6 text-gray-900 dark:text-white mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'general'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              General
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  activeTab === 'users'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                User Management
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {activeTab === 'general' ? (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  General Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  General settings content goes here.
                </p>
              </div>
            ) : (
              isAdmin && (
                <UserManagement />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
