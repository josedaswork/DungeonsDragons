import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function TraitsPanel({ character }) {
  const { t } = useI18n();
  const sections = [
    { label: t('traits_and_features'), content: character.traits },
    { label: t('personality_traits'), content: character.personality_traits },
    { label: t('ideals'), content: character.ideals },
    { label: t('bonds'), content: character.bonds },
    { label: t('flaws'), content: character.flaws },
    { label: t('other_proficiencies'), content: character.other_proficiencies },
  ].filter(s => s.content);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.label} className="bg-muted/50 rounded-lg p-3 border border-border">
          <h4 className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-2">{section.label}</h4>
          <p className="text-sm font-inter text-foreground leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
