import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockTripData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-glass px-4 py-3 text-xs">
        <p className="font-semibold text-navy-900 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TripChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={mockTripData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trips" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0D9488" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="passengers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1A3A6B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1A3A6B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="trips"      name="Trips"      stroke="#0D9488" strokeWidth={2.5} fill="url(#trips)"      dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        <Area type="monotone" dataKey="passengers" name="Passengers" stroke="#1A3A6B" strokeWidth={2}   fill="url(#passengers)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
