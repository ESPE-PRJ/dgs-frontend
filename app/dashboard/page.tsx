'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout currentPage="Home" userRole={user.role}>
      <div className="p-8">
        {/* Header */}
        <header className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Welcome, </span>
              <span className="font-medium text-gray-900">{user.username}</span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Welcome Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.role.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Your Role
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-green-500">people</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user.role === 'Patient' ? 'My Appointments' : 'Active Patients'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role === 'Patient' ? '3' : '24'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-orange-500">assignment</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user.role === 'Patient' ? 'Medications' : 'Pending Tasks'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role === 'Patient' ? '5' : '7'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-blue-500">check_circle</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Today
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        12
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.role === 'Administrator' && (
                  <>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">people</span>
                      <span className="text-gray-700">Manage Users</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">settings</span>
                      <span className="text-gray-700">System Settings</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">assessment</span>
                      <span className="text-gray-700">View Reports</span>
                    </button>
                  </>
                )}
                {user.role === 'Doctor' && (
                  <>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">people</span>
                      <span className="text-gray-700">Patient Records</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">healing</span>
                      <span className="text-gray-700">New Treatment</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">medication</span>
                      <span className="text-gray-700">Prescriptions</span>
                    </button>
                  </>
                )}
                {user.role === 'Patient' && (
                  <>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">healing</span>
                      <span className="text-gray-700">My Treatments</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">medication</span>
                      <span className="text-gray-700">My Medications</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">event</span>
                      <span className="text-gray-700">Appointments</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <span className="material-icons text-white text-sm">check</span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span className="font-medium text-gray-900">Login successful</span>
                            <span className="whitespace-nowrap">2 minutes ago</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Successfully logged in as {user.role}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <span className="material-icons text-white text-sm">info</span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span className="font-medium text-gray-900">Dashboard accessed</span>
                            <span className="whitespace-nowrap">5 minutes ago</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Viewed dashboard overview</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
