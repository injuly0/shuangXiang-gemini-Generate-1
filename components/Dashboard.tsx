import React from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell 
} from 'recharts';
import { DailyRecord } from '../types';
import { Download } from 'lucide-react';

interface DashboardProps {
  records: DailyRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  // Process data for charts
  // Sort by date ascending
  const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-14); // Last 14 entries

  const data = sortedRecords.map(r => ({
    date: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    mood: r.moodValue,
    sleep: r.sleepQuality, // 1-5
    energy: r.energyLevel === 'Low' ? 1 : r.energyLevel === 'Medium' ? 3 : 5
  }));

  const handleExport = () => {
    alert("In a real app, this would generate a PDF for your doctor including medication logs and mood charts.");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-stone-800">Patterns</h2>
        <button onClick={handleExport} className="text-stone-500 p-2 hover:bg-stone-100 rounded-full">
          <Download size={20} />
        </button>
      </div>

      {/* Mood x Energy Chart */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-500 mb-4 ml-2">Mood (Line) vs Energy (Bar)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 10, fill: '#78716c'}} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis domain={[-5, 5]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
              
              {/* Energy as subtle background bars */}
              <Bar dataKey="energy" barSize={12} fill="#f5f5f4" radius={[4, 4, 0, 0]}>
                 {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.energy > 3 ? '#fee2e2' : '#f5f5f4'} />
                  ))}
              </Bar>
              
              {/* Mood as the main line */}
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#57534e" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 0, fill: '#57534e' }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs text-stone-400">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-stone-600"></div>Mood</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-100"></div>High Energy</div>
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-500 mb-4 ml-2">Sleep Quality</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[0, 5]} hide />
              <Tooltip />
              <Bar dataKey="sleep" barSize={20} radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sleep < 3 ? '#94a3b8' : '#cbd5e1'} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-stone-100 rounded-xl text-sm text-stone-600">
        <p><strong>Note:</strong> Correlation does not imply causation. Use these patterns to start a conversation with your care provider.</p>
      </div>
    </div>
  );
};

export default Dashboard;
