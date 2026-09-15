import React from 'react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';
import { Compass } from 'lucide-react';

export default function SkillRadarChart({ radarData }) {
  return (
    <div className="card p-6 flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="section-title flex items-center gap-2">
          <Compass size={18} className="text-accent" /> 5-Axis Competency Radar
        </h3>
        <p className="text-xs text-secondary mt-1">
          Comparing your current profile against ideal role benchmarks across 5 technical dimensions.
        </p>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="var(--border-light)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} />
            <Radar name="Student Level" dataKey="Student" stroke="#4E715D" fill="#4E715D" fillOpacity={0.5} />
            <Radar name="Target Benchmark" dataKey="Target" stroke="#D97706" fill="#D97706" fillOpacity={0.15} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
