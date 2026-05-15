import type React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  style,
  children,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  };

  const variantColors: Record<
    'primary' | 'secondary' | 'danger' | 'warning',
    string
  > = {
    primary: '#3b82f6',
    secondary: '#64748b',
    danger: '#ef4444',
    warning: '#eab308',
  };

  return (
    <button
      style={{
        ...baseStyle,
        backgroundColor: variantColors[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
