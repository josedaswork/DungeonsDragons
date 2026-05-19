import React, { useState } from 'react';
import { Coins, Plus, Minus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function CurrencyPanel({ character, onUpdate }) {
  const { t } = useI18n();
  const [amounts, setAmounts] = useState({});

  const CURRENCIES = [
    { key: 'platinum', label: t('platinum_abbr'), color: 'text-slate-300', bg: 'bg-slate-700/50', border: 'border-slate-500/50' },
    { key: 'gold',     label: t('gold_abbr'),  color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-600/40' },
    { key: 'electrum', label: t('electrum_abbr'),  color: 'text-teal-300',   bg: 'bg-teal-900/30',   border: 'border-teal-600/40' },
    { key: 'silver',   label: t('silver_abbr'),  color: 'text-gray-300',   bg: 'bg-gray-700/40',   border: 'border-gray-500/40' },
    { key: 'copper',   label: t('copper_abbr'),  color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/40' },
  ];

  const handleChange = (key, delta) => {
    const current = character[key] ?? 0;
    const newVal = Math.max(0, current + delta);
    onUpdate({ [key]: newVal });
  };

  const handleInput = (key, val) => setAmounts(a => ({ ...a, [key]: val }));

  const handleBlur = (key) => {
    const val = parseInt(amounts[key]);
    if (!isNaN(val) && val >= 0) onUpdate({ [key]: val });
    setAmounts(a => ({ ...a, [key]: undefined }));
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Coins className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-inter font-semibold uppercase tracking-wider text-muted-foreground">{t('coins')}</h3>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {CURRENCIES.map(({ key, label, color, bg, border }) => {
          const displayVal = amounts[key] !== undefined ? amounts[key] : (character[key] ?? 0);
          return (
            <div key={key} className={`${bg} ${border} border rounded-lg p-2 flex flex-col items-center gap-1`}>
              <button onClick={() => handleChange(key, 1)} className={`w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${color}`}>
                <Plus className="w-3 h-3" />
              </button>
              <input type="number" min="0" value={displayVal}
                onChange={e => handleInput(key, e.target.value)}
                onBlur={() => handleBlur(key)}
                className={`w-full text-center text-lg font-cinzel font-bold ${color} bg-transparent border-none outline-none focus:bg-white/5 rounded`} />
              <div className={`text-[10px] font-inter font-semibold tracking-wider ${color} opacity-80`}>{label}</div>
              <button onClick={() => handleChange(key, -1)} className={`w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${color}`}>
                <Minus className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
