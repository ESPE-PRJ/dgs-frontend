interface RoleSelectorProps {
  roles: string[];
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
}

export default function RoleSelector({
  roles,
  selectedRole,
  onRoleSelect
}: RoleSelectorProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Role
      </h2>
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onRoleSelect(role)}
            className={`w-full sm:w-auto flex-grow text-center py-3 px-4 border rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedRole === role
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
