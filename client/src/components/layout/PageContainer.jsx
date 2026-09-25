export default function PageContainer({ children, className = '' }) {
  return <main className={`mx-auto w-full max-w-[1480px] p-4 md:p-7 ${className}`}>{children}</main>;
}
