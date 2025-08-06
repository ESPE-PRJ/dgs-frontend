'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import InputField from '../components/InputField';

interface User {
  username: string;
  email: string;
  role: string;
}

interface UserProfile {
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// Datos expandidos simulados basados en los usuarios existentes
const getUserProfileData = (username: string): UserProfile => {
  const baseProfiles: Record<string, UserProfile> = {
    admin: {
      username: 'admin',
      email: 'admin@pharmalink.com',
      role: 'Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1980-01-15',
      address: '123 Admin Street, Tech City, TC 12345',
      emergencyContact: 'Emergency Services',
      emergencyPhone: '+1 (555) 911-0000'
    },
    paciente: {
      username: 'paciente',
      email: 'paciente@pharmalink.com',
      role: 'Patient',
      firstName: 'María',
      lastName: 'González',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1975-03-22',
      address: '456 Patient Avenue, Health City, HC 23456',
      emergencyContact: 'Carlos González (Esposo)',
      emergencyPhone: '+1 (555) 345-6789'
    },
    medico: {
      username: 'medico',
      email: 'medico@pharmalink.com',
      role: 'Doctor',
      firstName: 'Dr. Roberto',
      lastName: 'Martínez',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1970-07-10',
      address: '789 Medical Plaza, Care City, CC 34567',
      emergencyContact: 'Ana Martínez (Esposa)',
      emergencyPhone: '+1 (555) 456-7890'
    }
  };

  return baseProfiles[username] || baseProfiles.admin;
};

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Cargar datos del perfil
      const userProfile = getUserProfileData(parsedUser.username);
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
    setIsLoading(false);
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    setIsSaving(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Actualizar datos locales
    setProfile(editedProfile);
    
    // Actualizar datos del usuario en localStorage si es necesario
    if (typeof window !== 'undefined' && user) {
      const updatedUser = {
        ...user,
        email: editedProfile.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    setIsEditing(false);
    setIsSaving(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  if (isLoading || !user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout currentPage="Settings" userRole={user.role}>
      <div className="p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span className="material-icons mr-2 text-sm">edit</span>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="material-icons mr-2 text-sm">cancel</span>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2 text-sm">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <span className="material-icons mr-2">check_circle</span>
            {successMessage}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-500 mt-1">Update your account details and personal information</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Username (No editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>

              {/* Role (No editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Role is assigned by administrators</p>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <InputField
                    type="text"
                    value={editedProfile?.firstName || ''}
                    onChange={(value) => handleInputChange('firstName', value)}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.firstName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <InputField
                    type="text"
                    value={editedProfile?.lastName || ''}
                    onChange={(value) => handleInputChange('lastName', value)}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.lastName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <InputField
                    type="email"
                    value={editedProfile?.email || ''}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email"
                  />
                ) : (
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <InputField
                    type="text"
                    value={editedProfile?.phone || ''}
                    onChange={(value) => handleInputChange('phone', value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.phone}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile?.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                ) : (
                  <textarea
                    value={profile.address}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    rows={3}
                  />
                )}
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <InputField
                    type="text"
                    value={editedProfile?.emergencyContact || ''}
                    onChange={(value) => handleInputChange('emergencyContact', value)}
                    placeholder="Enter emergency contact name"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.emergencyContact}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                {isEditing ? (
                  <InputField
                    type="text"
                    value={editedProfile?.emergencyPhone || ''}
                    onChange={(value) => handleInputChange('emergencyPhone', value)}
                    placeholder="Enter emergency contact phone"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.emergencyPhone}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
            <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="material-icons mr-2">lock</span>
                Change Password
              </button>
              
              <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span className="material-icons mr-2">download</span>
                Download My Data
              </button>
              
              <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <span className="material-icons mr-2">delete</span>
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
