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
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  schedule: string[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Paused';
  prescribedBy: string;
  notes: string;
}

// Datos simulados de tratamientos
const mockTreatments: Treatment[] = [
  {
    id: 'TRT-001',
    patientName: 'John Smith',
    patientId: 'PAT-12345',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    schedule: ['08:00', '20:00'],
    startDate: '2025-01-01',
    endDate: '2025-03-01',
    status: 'Active',
    prescribedBy: 'Dr. Johnson',
    notes: 'Take with meals to reduce stomach upset'
  },
  {
    id: 'TRT-002',
    patientName: 'John Smith',
    patientId: 'PAT-12345',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    schedule: ['09:00'],
    startDate: '2025-01-01',
    endDate: '2025-06-01',
    status: 'Active',
    prescribedBy: 'Dr. Johnson',
    notes: 'Monitor blood pressure weekly'
  },
  {
    id: 'TRT-003',
    patientName: 'Maria Garcia',
    patientId: 'PAT-67890',
    medication: 'Amoxicillin',
    dosage: '250mg',
    frequency: 'Three times daily',
    schedule: ['08:00', '14:00', '20:00'],
    startDate: '2025-01-20',
    endDate: '2025-01-30',
    status: 'Completed',
    prescribedBy: 'Dr. Wilson',
    notes: 'Complete full course even if symptoms improve'
  }
];

export default function Treatments() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);
  const [showNewTreatmentForm, setShowNewTreatmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [newTreatment, setNewTreatment] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    schedule: [''],
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
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

  const handleAddScheduleTime = () => {
    setNewTreatment(prev => ({
      ...prev,
      schedule: [...prev.schedule, '']
    }));
  };

  const handleRemoveScheduleTime = (index: number) => {
    setNewTreatment(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleScheduleTimeChange = (index: number, value: string) => {
    setNewTreatment(prev => ({
      ...prev,
      schedule: prev.schedule.map((time, i) => i === index ? value : time)
    }));
  };

  const handleSubmitTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const treatment: Treatment = {
      id: `TRT-${String(treatments.length + 1).padStart(3, '0')}`,
      patientName: selectedPatient,
      patientId: `PAT-${Math.floor(Math.random() * 100000)}`,
      medication: newTreatment.medication,
      dosage: newTreatment.dosage,
      frequency: newTreatment.frequency,
      schedule: newTreatment.schedule.filter(time => time !== ''),
      startDate: newTreatment.startDate,
      endDate: newTreatment.endDate,
      status: 'Active',
      prescribedBy: user?.username || 'Unknown',
      notes: newTreatment.notes
    };

    setTreatments(prev => [...prev, treatment]);
    setShowNewTreatmentForm(false);
    setNewTreatment({
      medication: '',
      dosage: '',
      frequency: '',
      schedule: [''],
      startDate: '',
      endDate: '',
      notes: ''
    });
    setSelectedPatient('');
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filtrar tratamientos según el rol
  const filteredTreatments = user.role === 'Patient' 
    ? treatments.filter(t => t.patientName === 'John Smith') // Simular que John Smith es el paciente logueado
    : treatments;

  return (
    <DashboardLayout currentPage="Treatments" userRole={user.role}>
      <div className="p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {user.role === 'Patient' ? 'My Treatments' : 'Patient Treatments'}
          </h1>
          {(user.role === 'Doctor' || user.role === 'Administrator') && (
            <button
              onClick={() => setShowNewTreatmentForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="material-icons mr-2 text-sm">add</span>
              New Treatment
            </button>
          )}
        </header>

        {/* New Treatment Form Modal */}
        {showNewTreatmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">New Treatment</h2>
                <button
                  onClick={() => setShowNewTreatmentForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmitTreatment} className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient
                  </label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a patient</option>
                    <option value="John Smith">John Smith (PAT-12345)</option>
                    <option value="Maria Garcia">Maria Garcia (PAT-67890)</option>
                    <option value="Robert Johnson">Robert Johnson (PAT-54321)</option>
                  </select>
                </div>

                {/* Medication */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication
                  </label>
                  <input
                    type="text"
                    value={newTreatment.medication}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, medication: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Metformin"
                    required
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newTreatment.dosage}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newTreatment.frequency}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule (Times)
                  </label>
                  {newTreatment.schedule.map((time, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleScheduleTimeChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {newTreatment.schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleTime(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <span className="material-icons">remove_circle</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddScheduleTime}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <span className="material-icons mr-1">add_circle</span>
                    Add time
                  </button>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newTreatment.startDate}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newTreatment.endDate}
                      onChange={(e) => setNewTreatment(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newTreatment.notes}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional instructions or notes..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Create Treatment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTreatmentForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Treatments List */}
        <div className="space-y-6">
          {filteredTreatments.map((treatment) => (
            <div key={treatment.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{treatment.medication}</h3>
                  <p className="text-gray-600">{treatment.patientName} ({treatment.patientId})</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  treatment.status === 'Active' ? 'bg-green-100 text-green-800' :
                  treatment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {treatment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dosage</label>
                  <p className="text-gray-800">{treatment.dosage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Frequency</label>
                  <p className="text-gray-800">{treatment.frequency}</p>
                </div>
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
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-gray-800">{treatment.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Prescribed by: {treatment.prescribedBy}</span>
                {(user.role === 'Doctor' || user.role === 'Administrator') && (
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Pause</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-gray-400 text-6xl mb-4">healing</span>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No treatments found</h3>
            <p className="text-gray-500">
              {user.role === 'Patient' 
                ? 'You have no active treatments at the moment.'
                : 'Start by creating a new treatment for a patient.'
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
