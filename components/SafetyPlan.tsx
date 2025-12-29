import React from 'react';
import { Phone, HeartHandshake, X } from 'lucide-react';
import { SafetyPlan as SafetyPlanType } from '../types';

interface SafetyPlanProps {
  plan: SafetyPlanType;
  onClose: () => void;
}

const SafetyPlan: React.FC<SafetyPlanProps> = ({ plan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="bg-stone-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Safety Plan</h2>
            <p className="text-stone-400 text-sm">You are not alone.</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Reminders */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Reminders to Self</h3>
            {plan.reminders.map((r, i) => (
              <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-stone-700 font-medium">
                "{r}"
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Contacts</h3>
            {plan.contacts.map((c, i) => (
              <a 
                key={i} 
                href={`tel:${c.phone}`}
                className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-4 rounded-xl border border-green-100 transition-colors group"
              >
                <div>
                  <div className="font-bold text-stone-800">{c.name}</div>
                  <div className="text-xs text-stone-500">{c.relation}</div>
                </div>
                <div className="bg-green-200 text-green-800 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
              </a>
            ))}
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-stone-400">
              If you are in immediate danger, please call emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPlan;
