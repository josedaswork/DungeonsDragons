import React, { useState } from 'react';
import { Wand2, Flame, Ruler } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/* ---- helpers ---- */

/** Normalize any spell format into a structured object.
 *  Handles: plain string, {name,desc} with JSON in desc, {name,...structured} */
function normalizeSpell(spell) {
  if (typeof spell === 'string') return { name: spell };
  if (!spell) return { name: '' };
  const s = { ...spell };
  // If 'desc' contains JSON (from old server writing JSON to col B as plain desc), parse it
  if (s.desc && typeof s.desc === 'string' && !s.type && !s.casting_time && !s.description) {
    try {
      const parsed = JSON.parse(s.desc);
      if (typeof parsed === 'object' && parsed !== null) {
        Object.assign(s, parsed);
        delete s.desc;
      }
    } catch { /* not JSON, keep as legacy description */ }
  }
  // Migrate legacy 'desc' to 'description' if no structured 'description' exists
  if (s.desc && !s.description) {
    s.description = s.desc;
    delete s.desc;
  }
  return s;
}

function getSpellName(spell) {
  return typeof spell === 'object' ? spell.name : spell;
}

function hasSpellDetails(spell) {
  const s = normalizeSpell(spell);
  return !!(s.type || s.casting_time || s.range || s.description || s.higher_levels);
}

function feetToMeters(ft) {
  return Math.round(ft * 0.3048 * 100) / 100;
}

function formatRange(spell, showMeters) {
  if (!spell.range) return null;
  const unit = spell.range_unit || 'feet';
  if (unit === 'self' || unit === 'touch') return spell.range;
  const num = Number(spell.range);
  if (!isNaN(num) && (unit === 'feet' || unit === 'meters')) {
    if (showMeters && unit === 'feet') return `${feetToMeters(num)} m`;
    if (!showMeters && unit === 'meters') return `${Math.round(num / 0.3048)} ft`;
    return `${num} ${unit === 'feet' ? 'ft' : 'm'}`;
  }
  return spell.range;
}

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

function SpellList({ title, spells, onSpellClick }) {
  if (!spells || spells.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-1">
        {spells.map((spell, i) => {
          const name = getSpellName(spell);
          const detailed = hasSpellDetails(spell);
          return (
            <button key={i} onClick={() => onSpellClick(spell)}
              className="w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors text-left group">
              <Wand2 className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-sm font-inter text-foreground flex-1">{name}</span>
              {detailed && <span className="text-[10px] text-primary/60 group-hover:text-primary transition-colors">ⓘ</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpellInfoRow({ label, children }) {
  if (!children) return null;
  return (
    <div className="flex gap-2 py-1 border-b border-border/50 last:border-0">
      <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-inter text-foreground flex-1">{children}</span>
    </div>
  );
}

function SpellDetailDialog({ spell, open, onClose }) {
  const { t } = useI18n();
  const [showMeters, setShowMeters] = useState(false);

  if (!spell) return null;
  const s = normalizeSpell(spell);
  const hasAny = hasSpellDetails(spell);

  const components = [s.comp_v && 'V', s.comp_s && 'S', s.comp_m && 'M'].filter(Boolean).join(' ');

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-sm mx-auto rounded-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-primary text-lg flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> {s.name}
          </DialogTitle>
          {s.type && (
            <p className="text-xs font-inter text-primary/70 italic">{s.type}</p>
          )}
        </DialogHeader>
        {hasAny ? (
          <div className="space-y-2">
            {/* Unit toggle */}
            {s.range && (
              <button
                onClick={() => setShowMeters(!showMeters)}
                className={`flex items-center gap-1.5 text-xs font-inter px-2 py-1 rounded-full border transition-colors ${showMeters ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                <Ruler className="w-3 h-3" />
                {showMeters ? 'ft → m ✓' : 'ft → m'}
              </button>
            )}
            {/* Info rows */}
            <div className="bg-muted/50 rounded-lg border border-border p-3 space-y-0">
              <SpellInfoRow label={t('casting_time')}>{s.casting_time}</SpellInfoRow>
              <SpellInfoRow label={t('spell_range')}>{formatRange(s, showMeters)}</SpellInfoRow>
              {components && <SpellInfoRow label={t('components')}>
                {components}{s.comp_m && s.material_desc ? ` (${s.material_desc})` : ''}
              </SpellInfoRow>}
              <SpellInfoRow label={t('spell_duration')}>{s.duration}</SpellInfoRow>
              <SpellInfoRow label={t('spell_classes')}>{s.classes}</SpellInfoRow>
            </div>
            {/* Description */}
            {s.description && (
              <p className="text-sm font-inter text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {s.description}
              </p>
            )}
            {/* Higher levels */}
            {s.higher_levels && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-[10px] font-inter font-semibold uppercase tracking-wider text-primary mb-1">{t('higher_levels')}</p>
                <p className="text-xs font-inter text-foreground/80 whitespace-pre-wrap leading-relaxed">{s.higher_levels}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm font-inter text-muted-foreground italic">{t('no_description')}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function SpellsPanel({ character, onToggleSlot }) {
  const { t } = useI18n();
  const [selectedSpell, setSelectedSpell] = useState(null);
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
      <SpellList title={t('cantrips')} spells={character.cantrips} onSpellClick={setSelectedSpell} />
      <SpellList title={`${t('level')} 1`} spells={character.spells_level_1} onSpellClick={setSelectedSpell} />
      <SpellList title={`${t('level')} 2`} spells={character.spells_level_2} onSpellClick={setSelectedSpell} />
      <SpellList title={`${t('level')} 3`} spells={character.spells_level_3} onSpellClick={setSelectedSpell} />
      <SpellDetailDialog spell={selectedSpell} open={!!selectedSpell} onClose={() => setSelectedSpell(null)} />
    </div>
  );
}
