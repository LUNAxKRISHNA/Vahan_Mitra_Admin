import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockRouteTrafficData } from '../../data/mockData';

export default function RouteTrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={mockRouteTrafficData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="route"
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #F1F5F9' }}
          cursor={{ fill: 'rgba(13,148,136,0.06)' }}
        />
        <Bar dataKey="trips"      name="Trips"      fill="#0D9488" radius={[4,4,0,0]} maxBarSize={28} />
        <Bar dataKey="passengers" name="Passengers" fill="#0F2044" radius={[4,4,0,0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
