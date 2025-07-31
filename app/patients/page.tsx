'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

interface User {
  username: string;
  email: string;
  role: string;
}

export default function Patients() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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
    <DashboardLayout currentPage="Patients" userRole={user.role}>
      <div className="p-8">
        {/* Header */}
        <header className="flex items-center mb-8">
          <button className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="material-icons text-gray-600">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
        </header>

        {/* Main Content */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Patient Header */}
          <div className="flex items-center mb-8">
            <img 
              alt="Patient's profile picture" 
              className="w-24 h-24 rounded-full mr-8 object-cover border-4 border-gray-200" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">John Smith</h2>
              <div className="space-y-1 text-gray-600">
                <p><span className="font-medium">Age:</span> 68 years old</p>
                <p><span className="font-medium">ID:</span> PAT-12345</p>
                <p><span className="font-medium">Phone:</span> +1 (555) 123-4567</p>
                <p><span className="font-medium">Email:</span> john.smith@email.com</p>
              </div>
            </div>
          </div>

          {/* Patient Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Medical Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="material-icons mr-2 text-blue-500">medical_information</span>
                  Medical Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Type</label>
                    <p className="text-gray-800">O+</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Allergies</label>
                    <p className="text-gray-800">Penicillin, Shellfish</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Chronic Conditions</label>
                    <p className="text-gray-800">Hypertension, Type 2 Diabetes</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="material-icons mr-2 text-red-500">emergency</span>
                  Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-800">Mary Smith (Spouse)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-800">+1 (555) 987-6543</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Relationship</label>
                    <p className="text-gray-800">Spouse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications & Recent Activity */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="material-icons mr-2 text-green-500">medication</span>
                  Current Medications
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">Metformin 500mg</h4>
                    <p className="text-sm text-gray-600">Twice daily with meals</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">Lisinopril 10mg</h4>
                    <p className="text-sm text-gray-600">Once daily in morning</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">Atorvastatin 20mg</h4>
                    <p className="text-sm text-gray-600">Once daily in evening</p>
                  </div>
                </div>
              </div>

              {/* Recent Visits */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="material-icons mr-2 text-purple-500">history</span>
                  Recent Visits
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">Routine Checkup</p>
                      <p className="text-sm text-gray-600">Dr. Johnson</p>
                    </div>
                    <span className="text-sm text-gray-500">Jan 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">Blood Work Follow-up</p>
                      <p className="text-sm text-gray-600">Dr. Wilson</p>
                    </div>
                    <span className="text-sm text-gray-500">Dec 28, 2024</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
              <span className="material-icons mr-2 text-sm">edit</span>
              Edit Patient
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
              <span className="material-icons mr-2 text-sm">add</span>
              New Prescription
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
              <span className="material-icons mr-2 text-sm">print</span>
              Print Summary
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
