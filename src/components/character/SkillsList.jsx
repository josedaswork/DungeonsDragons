import React from 'react';

const SKILLS = [
  { key: 'acrobatics', label: 'Acrobacias', ability: 'dexterity' },
  { key: 'animal_handling', label: 'T. con Animales', ability: 'wisdom' },
  { key: 'arcana', label: 'Arcano', ability: 'intelligence' },
  { key: 'athletics', label: 'Atletismo', ability: 'strength' },
  { key: 'deception', label: 'Engaño', ability: 'charisma' },
  { key: 'history', label: 'Historia', ability: 'intelligence' },
  { key: 'insight', label: 'Perspicacia', ability: 'wisdom' },
  { key: 'intimidation', label: 'Intimidación', ability: 'charisma' },
  { key: 'investigation', label: 'Investigación', ability: 'intelligence' },
  { key: 'medicine', label: 'Medicina', ability: 'wisdom' },
  { key: 'nature', label: 'Naturaleza', ability: 'intelligence' },
  { key: 'perception', label: 'Percepción', ability: 'wisdom' },
  { key: 'persuasion', label: 'Persuasión', ability: 'charisma' },
  { key: 'religion', label: 'Religión', ability: 'intelligence' },
  { key: 'sleight_of_hand', label: 'Juego de Manos', ability: 'dexterity' },
  { key: 'stealth', label: 'Sigilo', ability: 'dexterity' },
  { key: 'survival', label: 'Supervivencia', ability: 'wisdom' },
];

const ABILITY_ABBR = { strength: 'FUE', dexterity: 'DES', constitution: 'CON', intelligence: 'INT', wisdom: 'SAB', charisma: 'CAR' };

function getModifier(score) { return Math.floor((score - 10) / 2); }
function formatMod(mod) { return mod >= 0 ? `+${mod}` : `${mod}`; }

export default function SkillsList({ character }) {
  const skills = character.skills || {};
  const profBonus = character.proficiency_bonus || 2;

  return (
    <div className="space-y-0.5">
      {SKILLS.map((skill) => {
        const mod = getModifier(character[skill.ability] || 10);
        const isProficient = skills[skill.key] || false;
        const total = isProficient ? mod + profBonus : mod;
        return (
          <div key={skill.key} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isProficient ? 'bg-primary' : 'bg-border'}`} />
            <span className="text-sm font-inter font-medium text-primary w-8 text-right">{formatMod(total)}</span>
            <span className="text-sm font-inter text-foreground flex-1">{skill.label}</span>
            <span className="text-[10px] font-inter text-muted-foreground tracking-wide">{ABILITY_ABBR[skill.ability]}</span>
          </div>
        );
      })}
    </div>
  );
}
