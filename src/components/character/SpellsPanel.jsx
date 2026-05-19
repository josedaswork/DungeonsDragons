import React from 'react';
import { Wand2, Flame } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

function SpellSlotTracker({ level, total, used, onToggle, levelLabel }) {
  if (!total) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-inter text-muted-foreground w-16">{levelLabel} {level}</span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => onToggle(level, i)}
            className={`w-6 h-6 rounded border transition-all ${i < used ? 'bg-muted border-border text-muted-foreground' : 'bg-primary/20 border-primary/40 text-primary'}`}>
            <Flame className={`w-3 h-3 mx-auto ${i < used ? 'opacity-30' : ''}`} />
          </button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-inter">{total - used}/{total}</span>
    </div>
  );
}

function SpellList({ title, spells }) {
  if (!spells || spells.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-1">
        {spells.map((spell, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
            <Wand2 className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="text-sm font-inter text-foreground">{spell}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SpellsPanel({ character, onToggleSlot }) {
  const { t } = useI18n();
  const slots = character.spell_slots || {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
          <div className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('spellcasting_ability')}</div>
          <div className="text-sm font-cinzel font-bold text-primary">{character.spellcasting_ability || t('abbr_charisma')}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
          <div className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('spell_save_dc')}</div>
          <div className="text-lg font-cinzel font-bold text-foreground">{character.spell_save_dc || 0}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
          <div className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('spell_attack_bonus')}</div>
          <div className="text-lg font-cinzel font-bold text-foreground">+{character.spell_attack_bonus || 0}</div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-3 border border-border">
        <h4 className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('spell_slots')}</h4>
        <SpellSlotTracker level={1} total={slots.level_1_total || 0} used={slots.level_1_used || 0} onToggle={onToggleSlot} levelLabel={t('level')} />
        <SpellSlotTracker level={2} total={slots.level_2_total || 0} used={slots.level_2_used || 0} onToggle={onToggleSlot} levelLabel={t('level')} />
        <SpellSlotTracker level={3} total={slots.level_3_total || 0} used={slots.level_3_used || 0} onToggle={onToggleSlot} levelLabel={t('level')} />
      </div>
      <SpellList title={t('cantrips')} spells={character.cantrips} />
      <SpellList title={`${t('level')} 1`} spells={character.spells_level_1} />
      <SpellList title={`${t('level')} 2`} spells={character.spells_level_2} />
      <SpellList title={`${t('level')} 3`} spells={character.spells_level_3} />
    </div>
  );
}
