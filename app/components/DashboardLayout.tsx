'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
  userRole?: string;
}

export default function DashboardLayout({ 
  children, 
  currentPage = 'Home',
  userRole = 'Administrator' 
}: DashboardLayoutProps) {
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Sidebar currentPage={currentPage} userRole={userRole} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
