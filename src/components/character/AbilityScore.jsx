import React from 'react';

function getModifier(score) { return Math.floor((score - 10) / 2); }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}`; }

export default function AbilityScore({ label, score, isProficientSave, profBonus }) {
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
      <div className="flex items-center gap-1 mt-0.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isProficientSave ? 'bg-primary' : 'bg-muted'}`} />
        <span className="text-[10px] text-muted-foreground font-inter">Salv {formatMod(saveMod)}</span>
      </div>
    </div>
  );
}
