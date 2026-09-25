export default function Loader({ label = 'Loading', fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : 'min-h-40'} flex items-center justify-center gap-2 text-sm text-slate-500`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-forest" />
      {label}
    </div>
  );
}
