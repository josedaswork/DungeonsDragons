import React from 'react';

export default function TraitsPanel({ character }) {
  const sections = [
    { label: 'Rasgos y Atributos', content: character.traits },
    { label: 'Rasgos de Personalidad', content: character.personality_traits },
    { label: 'Ideales', content: character.ideals },
    { label: 'Vínculos', content: character.bonds },
    { label: 'Defectos', content: character.flaws },
    { label: 'Otras Competencias e Idiomas', content: character.other_proficiencies },
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
