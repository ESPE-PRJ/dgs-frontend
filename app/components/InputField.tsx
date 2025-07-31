interface InputFieldProps {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = ''
}: InputFieldProps) {
  return (
    <input
      className={`w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
}
