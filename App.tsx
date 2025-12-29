import React, { useState, useEffect } from 'react';
import { DailyRecord, AppState, ViewState, EnergyLevel, MedicationLog } from './types';
import * as Storage from './services/storageService';
import { EVENTS, SLEEP_ISSUES } from './constants';
import MoodTracker from './components/MoodTracker';
import MedicationTracker from './components/MedicationTracker';
import Dashboard from './components/Dashboard';
import SafetyPlan from './components/SafetyPlan';
import { LayoutGrid, PlusCircle, Settings, ShieldAlert, Moon, Sun, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('record');
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [medLogs, setMedLogs] = useState<MedicationLog[]>([]);
  const [safetyPlan, setSafetyPlan] = useState(Storage.getSafetyPlan());
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  // Today's Form State
  const [currentRecord, setCurrentRecord] = useState<DailyRecord>(() => {
    const existing = Storage.getTodayRecord();
    if (existing) return existing;
    return {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      moodValue: 0,
      energyLevel: EnergyLevel.MEDIUM,
      keywords: [],
      note: "",
      sleepTime: "",
      wakeTime: "",
      sleepQuality: 3,
      sleepIssues: [],
      events: [],
      eventImpact: 'neutral',
      warningSigns: []
    };
  });

  useEffect(() => {
    setRecords(Storage.getRecords());
    setMedLogs(Storage.getMedications());
  }, []);

  // Save current record whenever it changes (debounced effectively by React rendering)
  useEffect(() => {
    Storage.saveRecord(currentRecord);
    // Update local records list to reflect changes in Dashboard immediately
    setRecords(prev => {
      const idx = prev.findIndex(r => r.date === currentRecord.date);
      if (idx >= 0) {
        const newArr = [...prev];
        newArr[idx] = currentRecord;
        return newArr;
      }
      return [...prev, currentRecord];
    });

    // Safety Trigger
    if (currentRecord.moodValue <= -4 && !showSafetyModal) {
      // Don't auto-popup, but maybe show a banner. 
      // User requirement: "Mood -4 or -5" -> Show Safety options?
      // Requirement 10: "Depression degree 8" (mapped to -4/-5).
    }
  }, [currentRecord]);

  const handleMedLog = (log: MedicationLog) => {
    Storage.logMedication(log);
    setMedLogs(prev => [...prev, log]);
  };

  const updateRecord = (updates: Partial<DailyRecord>) => {
    setCurrentRecord(prev => ({ ...prev, ...updates }));
  };

  const toggleItem = (list: string[], item: string): string[] => {
    if (list.includes(item)) return list.filter(i => i !== item);
    return [...list, item];
  };

  // Render Functions
  const renderRecordView = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Date Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </h1>
          <p className="text-stone-400 text-sm">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        {(currentRecord.moodValue <= -4) && (
           <button 
             onClick={() => setShowSafetyModal(true)}
             className="bg-stone-800 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-pulse"
           >
             <ShieldAlert size={16} /> Help
           </button>
        )}
      </div>

      <MedicationTracker onLog={handleMedLog} logs={medLogs} />

      <MoodTracker 
        initialMood={currentRecord.moodValue}
        initialEnergy={currentRecord.energyLevel}
        initialKeywords={currentRecord.keywords}
        initialWarnings={currentRecord.warningSigns}
        onChange={(data) => updateRecord(data)}
      />

      {/* Sleep Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
        <h2 className="text-lg font-semibold text-stone-700 flex items-center gap-2">
          <Moon size={18} className="text-indigo-400" /> Sleep
        </h2>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-stone-400 ml-1">Bedtime</label>
            <input 
              type="time" 
              value={currentRecord.sleepTime}
              onChange={(e) => updateRecord({ sleepTime: e.target.value })}
              className="w-full bg-stone-50 p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-stone-400 ml-1">Wake Time</label>
            <input 
              type="time" 
              value={currentRecord.wakeTime}
              onChange={(e) => updateRecord({ wakeTime: e.target.value })}
              className="w-full bg-stone-50 p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-stone-400 ml-1 mb-2 block">Quality (1-5)</label>
          <div className="flex justify-between bg-stone-50 p-1 rounded-xl">
            {[1, 2, 3, 4, 5].map(q => (
              <button
                key={q}
                onClick={() => updateRecord({ sleepQuality: q })}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentRecord.sleepQuality === q ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {SLEEP_ISSUES.map(issue => (
            <button
              key={issue}
              onClick={() => updateRecord({ sleepIssues: toggleItem(currentRecord.sleepIssues, issue) })}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                currentRecord.sleepIssues.includes(issue) 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' 
                  : 'bg-stone-50 text-stone-500'
              }`}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <h2 className="text-lg font-semibold text-stone-700 flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-stone-400" /> Events Today
        </h2>
        <div className="flex flex-wrap gap-2">
          {EVENTS.map(ev => (
            <button
              key={ev}
              onClick={() => updateRecord({ events: toggleItem(currentRecord.events, ev) })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                currentRecord.events.includes(ev) 
                  ? 'bg-stone-800 text-white' 
                  : 'bg-stone-50 text-stone-500'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>
        {currentRecord.events.length > 0 && (
          <div className="mt-4">
             <label className="text-xs text-stone-400 ml-1">General Impact</label>
             <div className="grid grid-cols-3 gap-2 mt-1">
               {(['negative', 'neutral', 'positive'] as const).map(imp => (
                 <button
                    key={imp}
                    onClick={() => updateRecord({ eventImpact: imp })}
                    className={`p-2 text-xs rounded-lg capitalize ${
                      currentRecord.eventImpact === imp 
                      ? (imp === 'negative' ? 'bg-red-100 text-red-700' : imp === 'positive' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-800')
                      : 'bg-stone-50 text-stone-400'
                    }`}
                 >
                   {imp}
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Daily Note */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <textarea 
          placeholder="One sentence about today..."
          value={currentRecord.note}
          onChange={(e) => updateRecord({ note: e.target.value })}
          className="w-full bg-transparent resize-none focus:outline-none text-stone-700 placeholder:text-stone-300"
          rows={2}
        />
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 max-w-lg mx-auto relative shadow-2xl overflow-hidden">
      <main className="h-screen overflow-y-auto px-6 py-8 hide-scrollbar scroll-smooth">
        {view === 'record' && renderRecordView()}
        {view === 'dashboard' && <Dashboard records={records} />}
        {view === 'settings' && (
          <div className="p-4 text-center text-stone-400 mt-20">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Settings & Export Preferences</p>
            <p className="text-xs mt-4">Data is stored locally on your device.</p>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="absolute bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-stone-200/50 flex justify-around items-center z-40">
        <button 
          onClick={() => setView('record')}
          className={`p-3 rounded-xl transition-all ${view === 'record' ? 'bg-stone-100 text-stone-800' : 'text-stone-400'}`}
        >
          <PlusCircle size={24} />
        </button>
        <button 
          onClick={() => setView('dashboard')}
          className={`p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-stone-100 text-stone-800' : 'text-stone-400'}`}
        >
          <LayoutGrid size={24} />
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`p-3 rounded-xl transition-all ${view === 'settings' ? 'bg-stone-100 text-stone-800' : 'text-stone-400'}`}
        >
          <Settings size={24} />
        </button>
      </nav>

      {/* Safety Modal Overlay */}
      {showSafetyModal && (
        <SafetyPlan plan={safetyPlan} onClose={() => setShowSafetyModal(false)} />
      )}
    </div>
  );
};

export default App;
