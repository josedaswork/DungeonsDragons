import React from 'react';
import { useI18n } from '@/lib/i18n';

function getModifier(score) { return Math.floor((score - 10) / 2); }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}`; }

export default function AbilityScore({ label, score, isProficientSave, profBonus }) {
  const { t } = useI18n();
  const mod = getModifier(score);
  const saveMod = isProficientSave ? mod + profBonus : mod;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-24 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-card border-2 border-border rounded-lg group-hover:border-primary/50 transition-colors" />
        <span className="relative z-10 text-2xl font-cinzel font-bold text-primary">{formatMod(mod)}</span>
        <span className="relative z-10 text-xs text-muted-foreground font-inter mt-0.5">{score}</span>
      </div>
      <span className="mt-1.5 text-[10px] font-inter font-semibold tracking-widest uppercase text-muted-foreground">{label}</span>
      <div className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full transition-all ${isProficientSave ? 'bg-primary/15 shadow-[0_0_6px_rgba(var(--primary-rgb,168,85,247),0.35)]' : ''}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isProficientSave ? 'bg-primary shadow-[0_0_4px_rgba(var(--primary-rgb,168,85,247),0.6)]' : 'bg-muted'}`} />
        <span className={`text-[10px] font-inter ${isProficientSave ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{t('save')} {formatMod(saveMod)}</span>
      </div>
    </div>
  );
}
