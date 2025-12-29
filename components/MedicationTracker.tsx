import React, { useState } from 'react';
import { Camera, Check, Pill, Clock } from 'lucide-react';
import { MedicationLog } from '../types';

interface MedicationTrackerProps {
  onLog: (log: MedicationLog) => void;
  logs: MedicationLog[];
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ onLog, logs }) => {
  const [justLogged, setJustLogged] = useState(false);

  const handleQuickLog = () => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      name: "Quick Dose",
      timestamp: Date.now(),
      taken: true
    };
    onLog(newLog);
    
    // Visual feedback
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLog: MedicationLog = {
          id: Date.now().toString(),
          name: "Photo Log",
          timestamp: Date.now(),
          taken: true,
          photoUrl: reader.result as string
        };
        onLog(newLog);
        setJustLogged(true);
        setTimeout(() => setJustLogged(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get logs for today
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todaysLogs = logs.filter(l => l.timestamp >= todayStart.getTime());

  return (
    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
      <h2 className="text-lg font-semibold text-stone-700 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2"><Pill size={18} /> Medication</span>
        <span className="text-xs font-normal text-stone-400 bg-white px-2 py-1 rounded-full border">
          {todaysLogs.length} logged today
        </span>
      </h2>

      <div className="flex gap-4 items-center justify-center py-4">
        {/* The Big Button */}
        <button
          onClick={handleQuickLog}
          className={`
            relative w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95
            ${justLogged ? 'bg-green-500 text-white' : 'bg-stone-800 text-stone-100'}
          `}
        >
          {justLogged ? (
            <Check size={32} className="animate-bounce" />
          ) : (
            <>
              <span className="text-sm font-bold uppercase tracking-wider">Taken</span>
              <span className="text-xs opacity-60 mt-1">Tap now</span>
            </>
          )}
        </button>

        <span className="text-stone-300 font-medium">OR</span>

        {/* Photo Button */}
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handlePhotoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <button className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-stone-300 text-stone-400 flex items-center justify-center hover:bg-stone-50">
            <Camera size={24} />
          </button>
        </div>
      </div>

      {todaysLogs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="text-xs text-stone-400 mb-2">Today's History</div>
          <div className="space-y-2">
            {todaysLogs.slice().reverse().map(log => (
              <div key={log.id} className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-stone-100">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-stone-400"/>
                  <span className="font-mono text-stone-600">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {log.photoUrl && <div className="text-xs bg-stone-100 px-1 rounded">Image</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
