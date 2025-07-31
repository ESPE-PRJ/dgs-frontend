'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

interface User {
  username: string;
  email: string;
  role: string;
}

interface Treatment {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  schedule: string[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Paused';
  prescribedBy: string;
  notes: string;
  nextDose?: string;
}

// Datos simulados para el paciente
const patientTreatments: Treatment[] = [
  {
    id: 'TRT-001',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    schedule: ['08:00', '20:00'],
    startDate: '2025-01-01',
    endDate: '2025-03-01',
    status: 'Active',
    prescribedBy: 'Dr. Johnson',
    notes: 'Take with meals to reduce stomach upset',
    nextDose: '20:00'
  },
  {
    id: 'TRT-002',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    schedule: ['09:00'],
    startDate: '2025-01-01',
    endDate: '2025-06-01',
    status: 'Active',
    prescribedBy: 'Dr. Johnson',
    notes: 'Monitor blood pressure weekly',
    nextDose: '09:00'
  }
];

export default function MyTreatments() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [treatments] = useState<Treatment[]>(patientTreatments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'Patient') {
      router.push('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const getTodaysSchedule = () => {
    const schedule: Array<{
      time: string;
      medication: string;
      dosage: string;
      taken: boolean;
    }> = [];

    treatments.forEach(treatment => {
      if (treatment.status === 'Active') {
        treatment.schedule.forEach(time => {
          schedule.push({
            time,
            medication: treatment.medication,
            dosage: treatment.dosage,
            taken: Math.random() > 0.5 // Simular si ya se tomó
          });
        });
      }
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const todaysSchedule = getTodaysSchedule();

  return (
    <DashboardLayout currentPage="My Treatments" userRole={user.role}>
      <div className="p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Treatments</h1>
          <p className="text-gray-600">Manage your medications and treatment schedule</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Today's Schedule</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                {todaysSchedule.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                    item.taken ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="text-lg font-bold text-gray-800">{item.time}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.medication}</h3>
                        <p className="text-sm text-gray-600">{item.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {item.taken ? (
                        <span className="flex items-center text-green-600">
                          <span className="material-icons mr-1">check_circle</span>
                          Taken
                        </span>
                      ) : (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Treatments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Active Treatments</h2>
              <div className="space-y-6">
                {treatments.filter(t => t.status === 'Active').map((treatment) => (
                  <div key={treatment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{treatment.medication}</h3>
                        <p className="text-gray-600">{treatment.dosage} - {treatment.frequency}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {treatment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Schedule</label>
                        <p className="text-gray-800">{treatment.schedule.join(', ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duration</label>
                        <p className="text-gray-800">{treatment.startDate} to {treatment.endDate}</p>
                      </div>
                    </div>

                    {treatment.notes && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-600">Instructions</label>
                        <p className="text-gray-800">{treatment.notes}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      Prescribed by: {treatment.prescribedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Treatments</span>
                  <span className="font-medium text-gray-800">{treatments.filter(t => t.status === 'Active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Doses</span>
                  <span className="font-medium text-gray-800">{todaysSchedule.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doses Taken</span>
                  <span className="font-medium text-green-600">{todaysSchedule.filter(s => s.taken).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-orange-600">{todaysSchedule.filter(s => !s.taken).length}</span>
                </div>
              </div>
            </div>

            {/* Next Dose */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Next Dose</h3>
              {todaysSchedule.filter(s => !s.taken).length > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {todaysSchedule.filter(s => !s.taken)[0]?.time}
                  </div>
                  <div className="text-gray-800 font-medium">
                    {todaysSchedule.filter(s => !s.taken)[0]?.medication}
                  </div>
                  <div className="text-gray-600">
                    {todaysSchedule.filter(s => !s.taken)[0]?.dosage}
                  </div>
                  <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Set Reminder
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <span className="material-icons text-4xl mb-2">check_circle</span>
                  <p>All doses taken for today!</p>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="text-center">
                <div className="text-gray-800 font-medium">Dr. Johnson</div>
                <div className="text-gray-600 text-sm">Primary Care Physician</div>
                <div className="text-blue-600 font-medium mt-2">+1 (555) 123-4567</div>
                <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Emergency Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
