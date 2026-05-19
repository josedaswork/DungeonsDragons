import React from 'react';
import { useI18n } from '@/lib/i18n';

const SKILL_GROUPS = [
  {
    ability: 'strength', labelKey: 'group_strength',
    skills: [
      { key: 'athletics', labelKey: 'skill_athletics' },
    ],
  },
  {
    ability: 'dexterity', labelKey: 'group_dexterity',
    skills: [
      { key: 'acrobatics', labelKey: 'skill_acrobatics' },
      { key: 'sleight_of_hand', labelKey: 'skill_sleight_of_hand' },
      { key: 'stealth', labelKey: 'skill_stealth' },
    ],
  },
  {
    ability: 'intelligence', labelKey: 'group_intelligence',
    skills: [
      { key: 'arcana', labelKey: 'skill_arcana' },
      { key: 'history', labelKey: 'skill_history' },
      { key: 'investigation', labelKey: 'skill_investigation' },
      { key: 'nature', labelKey: 'skill_nature' },
      { key: 'religion', labelKey: 'skill_religion' },
    ],
  },
  {
    ability: 'wisdom', labelKey: 'group_wisdom',
    skills: [
      { key: 'animal_handling', labelKey: 'skill_animal_handling' },
      { key: 'insight', labelKey: 'skill_insight' },
      { key: 'medicine', labelKey: 'skill_medicine' },
      { key: 'perception', labelKey: 'skill_perception' },
      { key: 'survival', labelKey: 'skill_survival' },
    ],
  },
  {
    ability: 'charisma', labelKey: 'group_charisma',
    skills: [
      { key: 'deception', labelKey: 'skill_deception' },
      { key: 'intimidation', labelKey: 'skill_intimidation' },
      { key: 'performance', labelKey: 'skill_performance' },
      { key: 'persuasion', labelKey: 'skill_persuasion' },
    ],
  },
];

function getModifier(score) { return Math.floor((score - 10) / 2); }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}`; }

export default function SkillsList({ character }) {
  const { t } = useI18n();
  const skills = character.skills || {};
  const profBonus = character.proficiency_bonus || 2;

  return (
    <div className="space-y-4">
      {SKILL_GROUPS.map((group) => {
        const abilityMod = getModifier(character[group.ability] || 10);
        return (
          <div key={group.ability}>
            <div className="flex items-center gap-2 mb-1 px-2">
              <span className="text-xs font-cinzel font-bold text-primary uppercase tracking-wider">{t(group.labelKey)}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-inter text-muted-foreground">{formatMod(abilityMod)}</span>
            </div>
            <div className="space-y-0.5">
              {group.skills.map((skill) => {
                const isProficient = skills[skill.key] === true;
                const total = isProficient ? abilityMod + profBonus : abilityMod;
                return (
                  <div key={skill.key} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isProficient ? 'bg-primary' : 'bg-border'}`} />
                    <span className="text-sm font-inter font-medium text-primary w-8 text-right">{formatMod(total)}</span>
                    <span className="text-sm font-inter text-foreground flex-1">{t(skill.labelKey)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
