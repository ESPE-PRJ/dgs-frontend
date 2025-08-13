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

interface MedicationSchedule {
  id: string;
  time: string;
  medication: string;
  dosage: string;
  treatmentId: string;
  taken: boolean;
  takenAt?: string;
  skipped: boolean;
  notes?: string;
}

interface Notification {
  id: string;
  type: 'medication' | 'reminder' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  medicationId?: string;
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
  },
  {
    id: 'TRT-003',
    medication: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'Once daily',
    schedule: ['12:00'],
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'Active',
    prescribedBy: 'Dr. Johnson',
    notes: 'Take with lunch for better absorption',
    nextDose: '12:00'
  }
];

const generateNotifications = (): Notification[] => {
  return [
    {
      id: 'notif-1',
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your Metformin 500mg',
      time: '20:00',
      read: false,
      medicationId: 'TRT-001'
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'Missed Medication',
      message: 'You missed your morning Lisinopril dose at 09:00',
      time: '10:30',
      read: false,
      medicationId: 'TRT-002'
    },
    {
      id: 'notif-3',
      type: 'reminder',
      title: 'Daily Reminder',
      message: "Don't forget to take your Vitamin D3 with lunch",
      time: '11:30',
      read: true
    }
  ];
};

export default function MyTreatments() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [treatments] = useState<Treatment[]>(patientTreatments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todaySchedule, setTodaySchedule] = useState<MedicationSchedule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      setNotifications(generateNotifications());
      generateTodaySchedule();
    }
    setIsLoading(false);
  }, [router]);

  const generateTodaySchedule = () => {
    const schedule: MedicationSchedule[] = [];
    let scheduleId = 1;

    treatments.forEach(treatment => {
      if (treatment.status === 'Active') {
        treatment.schedule.forEach(time => {
          const currentTime = new Date();
          const scheduleTime = new Date();
          const [hours, minutes] = time.split(':');
          scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          const isPast = currentTime > scheduleTime;
          const taken = isPast ? Math.random() > 0.3 : false;

          schedule.push({
            id: `schedule-${scheduleId++}`,
            time,
            medication: treatment.medication,
            dosage: treatment.dosage,
            treatmentId: treatment.id,
            taken,
            takenAt: taken ? `${time}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
            skipped: isPast && !taken ? Math.random() > 0.7 : false,
            notes: taken ? 'Taken as scheduled' : undefined
          });
        });
      }
    });

    schedule.sort((a, b) => a.time.localeCompare(b.time));
    setTodaySchedule(schedule);
  };

  const handleMedicationTaken = (scheduleId: string) => {
    const currentTime = new Date();
    const timeString = `${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')}`;

    setTodaySchedule(prev => prev.map(item => 
      item.id === scheduleId ? { ...item, taken: true, takenAt: timeString, notes: 'Confirmed by patient', skipped: false } : item
    ));

    setNotifications(prev => [{
      id: `notif-confirm-${Date.now()}`,
      type: 'medication',
      title: 'Medication Confirmed',
      message: `You've confirmed taking your medication at ${timeString}`,
      time: timeString,
      read: false
    }, ...prev]);
  };

  const handleMedicationSkipped = (scheduleId: string, reason: string = 'Patient choice') => {
    setTodaySchedule(prev => prev.map(item => 
      item.id === scheduleId ? { ...item, taken: false, skipped: true, notes: `Skipped: ${reason}` } : item
    ));

    setNotifications(prev => [{
      id: `notif-skip-${Date.now()}`,
      type: 'warning',
      title: 'Medication Skipped',
      message: `You've marked medication as skipped: ${reason}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif));
  };

  const getUnreadNotificationsCount = () => notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'medication': return 'medication';
      case 'warning': return 'warning';
      case 'reminder': return 'notifications';
      default: return 'info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'medication': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-red-600 bg-red-50';
      case 'reminder': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout currentPage="My Treatments" userRole={user.role}>
      <div className="p-8">
        {/* Header with Notifications */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">My Treatments</h1>
            <p className="text-gray-600">Manage your medications and treatment schedule</p>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className="relative p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="material-icons text-gray-600">notifications</span>
              {getUnreadNotificationsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {getUnreadNotificationsCount()}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotificationPanel && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${getNotificationColor(notif.type)}`}>
                            <span className="material-icons text-sm">{getNotificationIcon(notif.type)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Today's Medication Schedule</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                {todaySchedule.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border-l-4 ${
                    item.taken ? 'bg-green-50 border-green-500' 
                    : item.skipped ? 'bg-red-50 border-red-500'
                    : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <span className="text-lg font-bold text-gray-800">{item.time}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.medication}</h3>
                          <p className="text-sm text-gray-600">{item.dosage}</p>
                          {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.taken ? (
                          <div className="flex items-center text-green-600">
                            <span className="material-icons mr-1 text-sm">check_circle</span>
                            <span className="text-sm">Taken at {item.takenAt}</span>
                          </div>
                        ) : item.skipped ? (
                          <div className="flex items-center text-red-600">
                            <span className="material-icons mr-1 text-sm">cancel</span>
                            <span className="text-sm">Skipped</span>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMedicationTaken(item.id)}
                              className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm"
                            >
                              <span className="material-icons mr-1 text-sm">check</span>
                              Take Now
                            </button>
                            <button
                              onClick={() => handleMedicationSkipped(item.id, 'Side effects')}
                              className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 text-sm"
                            >
                              <span className="material-icons mr-1 text-sm">close</span>
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {todaySchedule.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <span className="material-icons text-4xl mb-2">medication</span>
                    <p>No medications scheduled for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 flex items-center">
                <span className="material-icons text-green-500 mr-2">check_circle</span>
                <div>
                  <p className="text-sm text-gray-600">Taken Today</p>
                  <p className="text-lg font-bold text-gray-800">{todaySchedule.filter(i => i.taken).length}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex items-center">
                <span className="material-icons text-blue-500 mr-2">schedule</span>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-lg font-bold text-gray-800">{todaySchedule.filter(i => !i.taken && !i.skipped).length}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex items-center">
                <span className="material-icons text-red-500 mr-2">cancel</span>
                <div>
                  <p className="text-sm text-gray-600">Skipped</p>
                  <p className="text-lg font-bold text-gray-800">{todaySchedule.filter(i => i.skipped).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Treatments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Active Treatments</h3>
              <div className="space-y-4">
                {treatments.map(t => (
                  <div key={t.id} className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{t.medication}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{t.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{t.dosage} • {t.frequency}</p>
                    <p className="text-xs text-gray-500">Prescribed by {t.prescribedBy}</p>
                    {t.notes && <p className="text-xs text-blue-600 mt-2 italic">{t.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-800 mb-2">Emergency Contact</h3>
              <p className="text-sm text-red-700 mb-2">If you experience severe side effects or need immediate medical attention:</p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <span className="material-icons mr-2">phone</span>
                  Call Emergency: 911
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span className="material-icons mr-2">local_hospital</span>
                  Contact Dr. Johnson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
const playNotificationSound = () => {
  const audio = new Audio('/sounds/medication-alert.mp3');
  audio.play().catch(err => console.log('Error playing audio:', err));
};
