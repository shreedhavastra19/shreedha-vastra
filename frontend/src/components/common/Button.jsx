const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  return (
    <button className={`${base} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
