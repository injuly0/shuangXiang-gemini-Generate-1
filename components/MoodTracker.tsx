import React, { useState, useEffect } from 'react';
import { EnergyLevel } from '../types';
import { MOOD_KEYWORDS, WARNING_SIGNS } from '../constants';
import { AlertCircle, Zap, Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

interface MoodTrackerProps {
  initialMood: number;
  initialEnergy: EnergyLevel;
  initialKeywords: string[];
  initialWarnings: string[];
  onChange: (data: { moodValue: number; energyLevel: EnergyLevel; keywords: string[]; warningSigns: string[] }) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  initialMood, initialEnergy, initialKeywords, initialWarnings, onChange 
}) => {
  const [mood, setMood] = useState(initialMood);
  const [energy, setEnergy] = useState<EnergyLevel>(initialEnergy);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>(initialWarnings);

  // Sync internal state if props change drastically (e.g. date switch), 
  // but usually we rely on local state driving the parent.
  useEffect(() => {
    onChange({ moodValue: mood, energyLevel: energy, keywords: selectedKeywords, warningSigns: selectedWarnings });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, energy, selectedKeywords, selectedWarnings]);

  const toggleKeyword = (k: string) => {
    if (selectedKeywords.includes(k)) {
      setSelectedKeywords(prev => prev.filter(i => i !== k));
    } else {
      setSelectedKeywords(prev => [...prev, k]);
    }
  };

  const toggleWarning = (w: string) => {
    if (selectedWarnings.includes(w)) {
      setSelectedWarnings(prev => prev.filter(i => i !== w));
    } else {
      setSelectedWarnings(prev => [...prev, w]);
    }
  };

  const getMoodColor = (m: number) => {
    if (m <= -3) return 'text-blue-500';
    if (m >= 3) return 'text-red-500';
    return 'text-stone-600';
  };

  const getMoodLabel = (m: number) => {
    if (m <= -4) return "Depressed";
    if (m <= -1) return "Low";
    if (m === 0) return "Stable";
    if (m <= 3) return "Elevated";
    return "Manic";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Mood Slider */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-stone-700">Mood</h2>
          <span className={`text-sm font-medium px-3 py-1 rounded-full bg-stone-100 ${getMoodColor(mood)}`}>
            {getMoodLabel(mood)} ({mood > 0 ? `+${mood}` : mood})
          </span>
        </div>
        
        <div className="relative h-12 flex items-center">
          <div className="absolute w-full h-2 bg-gradient-to-r from-blue-200 via-stone-200 to-red-200 rounded-full"></div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full absolute z-10 opacity-0 h-12 cursor-pointer"
          />
          <div 
            className="absolute h-6 w-6 bg-white border-2 border-stone-400 rounded-full shadow-md pointer-events-none transition-all duration-200 ease-out"
            style={{ left: `calc(${((mood + 5) / 10) * 100}% - 12px)` }}
          >
            <div className={`w-full h-full rounded-full opacity-30 ${mood < 0 ? 'bg-blue-500' : mood > 0 ? 'bg-red-500' : 'bg-stone-500'}`}></div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-stone-400 mt-2 px-1">
          <span>Low (-5)</span>
          <span>Stable (0)</span>
          <span>High (+5)</span>
        </div>

        {/* Dynamic Context Card based on Mood */}
        {(mood <= -4 || mood >= 4) && (
          <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-600">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 text-stone-500" />
              <div>
                <p className="font-medium mb-1">
                  {mood <= -4 ? "In a low valley?" : "Energy running high?"}
                </p>
                <p className="opacity-80">
                  {mood <= -4 
                    ? "Remember: gentle movements. Hydrate. This state is temporary." 
                    : "Watch for impulse spending. Try to ground yourself with a slow activity."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Energy Level */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <h2 className="text-lg font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" /> Energy
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[EnergyLevel.LOW, EnergyLevel.MEDIUM, EnergyLevel.HIGH].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setEnergy(lvl)}
              className={`py-3 px-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                energy === lvl 
                  ? 'bg-stone-800 text-white shadow-md' 
                  : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
              }`}
            >
              {lvl === EnergyLevel.LOW && <BatteryLow size={20} />}
              {lvl === EnergyLevel.MEDIUM && <BatteryMedium size={20} />}
              {lvl === EnergyLevel.HIGH && <BatteryFull size={20} />}
              <span className="text-xs font-medium">{lvl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 px-2">How it feels</h2>
        <div className="flex flex-wrap gap-2">
          {MOOD_KEYWORDS.map(k => (
            <button
              key={k}
              onClick={() => toggleKeyword(k)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedKeywords.includes(k)
                  ? 'bg-stone-200 text-stone-900 font-medium'
                  : 'bg-white border border-stone-200 text-stone-500'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Warning Signs */}
      <div>
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 px-2">Warning Signals</h2>
        <div className="flex flex-wrap gap-2">
          {WARNING_SIGNS.map(w => (
            <button
              key={w}
              onClick={() => toggleWarning(w)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedWarnings.includes(w)
                  ? 'bg-red-50 text-red-600 border border-red-200 font-medium'
                  : 'bg-white border border-stone-200 text-stone-400 border-dashed'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
