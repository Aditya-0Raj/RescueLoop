export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const styles = {
    primary: 'bg-forest text-white hover:bg-[#183d33]',
    secondary: 'border border-line bg-white text-ink hover:bg-stone-50',
    ghost: 'text-slate-600 hover:bg-stone-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-terracotta text-white hover:bg-[#bd6423]',
  };
  return (
    <button type={type} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${styles[variant] || styles.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
