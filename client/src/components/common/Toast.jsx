export default function Toast({ message, tone = 'success' }) {
  if (!message) return null;
  return <div className={`fixed bottom-5 right-5 z-50 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{message}</div>;
}
