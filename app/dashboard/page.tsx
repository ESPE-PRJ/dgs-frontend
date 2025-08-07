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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado solo en el cliente
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !user) {
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
              <span className="text-gray-600">Bienvenido, </span>
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
                        Tu Rol
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
                        {user.role === 'Patient' ? 'My Appointments' : 
                         user.role === 'Caregiver' ? 'My Patients' : 'Active Patients'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role === 'Patient' ? '3' : 
                         user.role === 'Caregiver' ? '8' : '24'}
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
                    <span className="material-icons text-orange-500">
                      {user.role === 'Caregiver' ? 'notifications_active' : 'assignment'}
                    </span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user.role === 'Patient' ? 'Medications' : 
                         user.role === 'Caregiver' ? 'Active Alerts' : 'Pending Tasks'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role === 'Patient' ? '5' : 
                         user.role === 'Caregiver' ? '3' : '7'}
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
                    <span className="material-icons text-blue-500">
                      {user.role === 'Caregiver' ? 'trending_up' : 'check_circle'}
                    </span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {user.role === 'Caregiver' ? 'Compliance Rate' : 'Completed Today'}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.role === 'Caregiver' ? '87%' : '12'}
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
                {user.role === 'Caregiver' && (
                  <>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-red-500 mr-3">notifications_active</span>
                      <span className="text-gray-700">View Alerts</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-blue-500 mr-3">people</span>
                      <span className="text-gray-700">My Patients</span>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="material-icons text-green-500 mr-3">healing</span>
                      <span className="text-gray-700">Patient Care</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Caregiver Alerts Section */}
          {user.role === 'Caregiver' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="material-icons text-red-500 mr-2">notifications_active</span>
                  Treatment Compliance Alerts
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <span className="material-icons text-red-500">warning</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-red-800">High Priority Alert</h4>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>María González</strong> has missed 3 consecutive medication doses (Metformin). 
                        Last taken: 2 days ago.
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                          Contact Patient
                        </button>
                        <button className="text-xs bg-white text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <span className="material-icons text-yellow-500">schedule</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-yellow-800">Medium Priority Alert</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        <strong>Carlos Rodríguez</strong> is 4 hours late for today's medication schedule.
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                          Send Reminder
                        </button>
                        <button className="text-xs bg-white text-yellow-600 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-50">
                          View Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <span className="material-icons text-orange-500">info</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-orange-800">Low Priority Alert</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        <strong>Ana Martínez</strong> requested to reschedule tomorrow's appointment.
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">
                          Review Request
                        </button>
                        <button className="text-xs bg-white text-orange-600 border border-orange-600 px-3 py-1 rounded hover:bg-orange-50">
                          Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patient Compliance Overview for Caregiver */}
          {user.role === 'Caregiver' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="material-icons text-green-500 mr-2">trending_up</span>
                  Patient Compliance Overview
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-green-700">Overall Compliance</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-700">Active Patients</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-yellow-700">Pending Actions</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-red-700">Critical Alerts</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Patient Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">María González took Metformin</span>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">Carlos Rodríguez missed Insulin dose</span>
                      </div>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">Ana Martínez completed daily medications</span>
                      </div>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
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
                            <span className="font-medium text-gray-900">Login exitoso</span>
                            <span className="whitespace-nowrap">hace 2 minutos</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Has iniciado sesión como {user.role}</p>
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
