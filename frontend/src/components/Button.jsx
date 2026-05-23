// src/components/Button.jsx
/*
  Reusable Button component
  
  Usage:
  <Button onClick={handleClick} variant="primary">
    Click Me
  </Button>
*/

export const Button = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold transition';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};