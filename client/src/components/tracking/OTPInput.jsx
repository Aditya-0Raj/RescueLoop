import { useRef } from 'react';

export default function OTPInput({ value, onChange }) {
  const refs = useRef([]);
  const digits = String(value).padEnd(4, '').slice(0, 4).split('');
  const handle = (index, next) => {
    const clean = next.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    const joined = nextDigits.join('');
    onChange(joined);
    if (clean && refs.current[index + 1]) refs.current[index + 1].focus();
  };
  return <div className="flex gap-2">{Array.from({ length: 4 }).map((_, index) => <input key={index} ref={(el) => { refs.current[index] = el; }} value={digits[index] || ''} maxLength={1} onChange={(event) => handle(index, event.target.value)} className="h-12 w-12 rounded-lg border border-line bg-white text-center text-lg font-semibold outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" inputMode="numeric" aria-label={`OTP digit ${index + 1}`} />)}</div>;
}
