'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentPage?: string;
  userRole?: string;
}

export default function Sidebar({ currentPage = 'Home', userRole = 'Administrator' }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Configurar menú según el rol del usuario
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Home', icon: 'home', href: '/dashboard' }
    ];

    if (userRole === 'Administrator') {
      return [
        ...baseItems,
        { name: 'Patients', icon: 'people', href: '/patients' },
        { name: 'Meds', icon: 'medication', href: '/medications' },
        { name: 'Treatments', icon: 'healing', href: '/treatments' },
        { name: 'Reports', icon: 'assessment', href: '/reports' },
        { name: 'Settings', icon: 'settings', href: '/settings' }
      ];
    } else if (userRole === 'Doctor') {
      return [
        ...baseItems,
        { name: 'Patients', icon: 'people', href: '/patients' },
        { name: 'Treatments', icon: 'healing', href: '/treatments' },
        { name: 'Meds', icon: 'medication', href: '/medications' },
        { name: 'Reports', icon: 'assessment', href: '/reports' },
        { name: 'Schedule', icon: 'event', href: '/schedule' }
      ];
    } else if (userRole === 'Patient') {
      return [
        ...baseItems,
        { name: 'My Treatments', icon: 'healing', href: '/my-treatments' },
        { name: 'My Meds', icon: 'medication', href: '/my-medications' },
        { name: 'Appointments', icon: 'event', href: '/appointments' },
        { name: 'Health Records', icon: 'folder_shared', href: '/health-records' },
        { name: 'Profile', icon: 'person', href: '/profile' }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
      {/* Logo - Fixed at top */}
      <div className="flex-shrink-0 p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
        PharmaLink
      </div>
      
      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a 
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors duration-200 ${
                  currentPage === item.name 
                    ? 'text-white bg-blue-500' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                href={item.href}
              >
                <span className="material-icons mr-3 text-sm">{item.icon}</span>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section and logout - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <span className="material-icons mr-3 text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
