import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockBusStatusData } from '../../data/mockData';

export default function BusStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={mockBusStatusData}
          cx="50%" cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {mockBusStatusData.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, n) => [v, n]}
          contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(15,32,68,0.08)' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span style={{ fontSize: 11, color: '#475569' }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
