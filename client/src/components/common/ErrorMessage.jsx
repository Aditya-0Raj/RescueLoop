export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
}
