import { MapPin, Navigation } from 'lucide-react';

export default function TrackingMap({ rescue }) {
  const pickup = rescue?.donor || 'Pickup location';
  const destination = rescue?.recipient || 'Recipient organization';

  return (
    <div className="relative h-[330px] overflow-hidden rounded-xl border border-line bg-[#e8efe9]">
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(35deg, transparent 45%, rgba(31,75,63,.08) 46%, rgba(31,75,63,.08) 48%, transparent 49%), linear-gradient(-25deg, transparent 47%, rgba(31,75,63,.07) 48%, rgba(31,75,63,.07) 50%, transparent 51%)', backgroundSize: '120px 80px' }} />
      <div className="absolute left-[22%] top-[28%] rounded-full bg-forest p-2 text-white shadow"><MapPin size={16} /></div>
      <div className="absolute right-[21%] bottom-[23%] rounded-full bg-terracotta p-2 text-white shadow"><MapPin size={16} /></div>
      <div className="absolute left-[45%] top-[47%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-800 text-white shadow-lg"><Navigation size={19} /></div>
      <div className="absolute bottom-4 left-4 rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-xs shadow"><p className="font-semibold">{pickup}</p><p className="text-slate-400">Pickup</p></div>
      <div className="absolute right-4 top-4 max-w-[180px] rounded-lg border border-white/80 bg-white/90 px-3 py-2 text-xs shadow"><p className="truncate font-semibold">{destination}</p><p className="text-slate-400">Destination</p></div>
    </div>
  );
}
