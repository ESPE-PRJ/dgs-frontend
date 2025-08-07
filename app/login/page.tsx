'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';

// Datos quemados para autenticación - cuatro usuarios
const VALID_USERS = [
  {
    username: 'admin',
    password: 'admin',
    role: 'Administrator',
    email: 'admin@pharmalink.com'
  },
  {
    username: 'paciente',
    password: 'paciente',
    role: 'Patient',
    email: 'paciente@pharmalink.com'
  },
  {
    username: 'medico',
    password: 'medico',
    role: 'Doctor',
    email: 'medico@pharmalink.com'
  },
  {
    username: 'cuidador',
    password: 'cuidador',
    role: 'Caregiver',
    email: 'cuidador@pharmalink.com'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Buscar usuario válido por username y password únicamente
    const validUser = VALID_USERS.find(user => 
      user.username === username && 
      user.password === password
    );

    if (validUser) {
      // Guardar datos del usuario en localStorage
      const userData = {
        username: validUser.username,
        email: validUser.email,
        role: validUser.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8 space-x-4">
  <img 
    src="/logo.png" 
    alt="PharmaLink Logo" 
    className="w-12 h-12 object-contain"
  />
  <h1 className="text-3xl font-bold text-gray-800">
    PharmaLink
  </h1>
</div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Credenciales de prueba */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800 font-medium mb-2">Test Credentials:</p>
          <div className="text-xs text-blue-600 space-y-1">
            <p><strong>Admin:</strong> admin/admin (Administrator role)</p>
            <p><strong>Patient:</strong> paciente/paciente (Patient role)</p>
            <p><strong>Doctor:</strong> medico/medico (Doctor role)</p>
            <p><strong>Caregiver:</strong> cuidador/cuidador (Caregiver role)</p>
            <p className="text-blue-500 font-medium mt-2">Role is automatically detected</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <InputField
              type="text"
              placeholder="Username"
              value={username}
              onChange={setUsername}
              required
            />
          </div>
          
          <div className="mb-6">
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              required
            />
          </div>
          
          <button
            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <a className="text-blue-500 hover:underline" href="#">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="text-blue-500 hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
