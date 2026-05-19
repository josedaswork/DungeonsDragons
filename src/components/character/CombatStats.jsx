import React from 'react';
import { Shield, Zap, Footprints, Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function CombatStats({ character, onUpdateHP }) {
  const { t } = useI18n();
  const stats = [
    { label: t('armor_class'), value: character.armor_class || 10, icon: Shield, color: 'text-primary' },
    { label: t('initiative'), value: `+${character.initiative || 0}`, icon: Zap, color: 'text-chart-2' },
    { label: t('speed'), value: `${character.speed || 30} ft`, icon: Footprints, color: 'text-chart-3' },
  ];

  const hpMax = character.hp_max || 0;
  const hpCurrent = character.hp_current ?? hpMax;
  const hpPercent = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-muted/50 rounded-lg p-3 text-center border border-border">
            <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
            <div className="text-xl font-cinzel font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] font-inter text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-xs font-inter font-semibold uppercase tracking-wider text-muted-foreground">{t('hit_points')}</span>
          </div>
          <span className="font-cinzel font-bold text-foreground">{hpCurrent} / {hpMax}</span>
        </div>
        <div className="h-3 bg-card rounded-full overflow-hidden border border-border">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${hpPercent}%`, background: hpPercent > 50 ? 'hsl(150 40% 45%)' : hpPercent > 25 ? 'hsl(45 70% 55%)' : 'hsl(0 70% 50%)' }} />
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button onClick={() => onUpdateHP(Math.max(0, hpCurrent - 1))} className="w-8 h-8 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors font-bold text-sm">−</button>
          <span className="text-sm font-inter text-muted-foreground w-16 text-center">{character.hp_temp ? `+${character.hp_temp} temp` : ''}</span>
          <button onClick={() => onUpdateHP(Math.min(hpMax, hpCurrent + 1))} className="w-8 h-8 rounded bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 transition-colors font-bold text-sm">+</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
          <div className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('hit_dice')}</div>
          <div className="text-lg font-cinzel font-bold text-foreground">{character.hit_dice || '1d8'}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
          <div className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('passive_perception')}</div>
          <div className="text-lg font-cinzel font-bold text-foreground">{character.passive_perception || 10}</div>
        </div>
      </div>
    </div>
  );
}
