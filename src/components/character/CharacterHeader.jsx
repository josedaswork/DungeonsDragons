import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function CharacterHeader({ character, onToggleInspiration }) {
  const { t } = useI18n();
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary via-card to-secondary border border-border p-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-foreground tracking-wide">
            {character.name || t('no_name')}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="text-sm font-inter text-primary font-medium">{character.class_level || t('class_unknown')}</span>
            {character.race && <><span className="text-muted-foreground">·</span><span className="text-sm font-inter text-muted-foreground">{character.race}</span></>}
            {character.background && <><span className="text-muted-foreground">·</span><span className="text-sm font-inter text-muted-foreground">{character.background}</span></>}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {character.alignment && <span className="text-xs font-inter text-muted-foreground">{character.alignment}</span>}
            {character.experience && <span className="text-xs font-inter text-muted-foreground">XP: {character.experience}</span>}
            {character.player_name && <span className="text-xs font-inter text-muted-foreground">{t('player')}: {character.player_name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-lg font-cinzel font-bold text-primary">+{character.proficiency_bonus || 2}</span>
            </div>
            <span className="text-[9px] font-inter text-muted-foreground uppercase tracking-wider mt-1 block leading-tight whitespace-pre-line">{t('proficiency')}</span>
          </div>
          <div className="text-center cursor-pointer" onClick={onToggleInspiration}>
              <div className={`relative w-12 h-12 rounded-lg border flex items-center justify-center transition-colors ${
                character.inspiration
                  ? 'bg-primary/20 border-primary/40'
                  : 'bg-muted/50 border-border hover:border-primary/30'
              }`}>
                {character.inspiration && (
                  <>
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-ping" style={{ top: '2px', right: '4px', animationDuration: '1.5s' }} />
                    <span className="absolute w-1 h-1 rounded-full bg-primary/80 animate-ping" style={{ bottom: '4px', left: '2px', animationDuration: '2s', animationDelay: '0.5s' }} />
                    <span className="absolute w-1 h-1 rounded-full bg-primary/60 animate-ping" style={{ top: '6px', left: '6px', animationDuration: '2.5s', animationDelay: '1s' }} />
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-primary/70 animate-ping" style={{ bottom: '2px', right: '6px', animationDuration: '1.8s', animationDelay: '0.3s' }} />
                    <span className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
                  </>
                )}
                <Star className={`relative z-10 w-5 h-5 transition-colors ${
                  character.inspiration
                    ? 'text-primary fill-primary drop-shadow-[0_0_6px_rgba(var(--primary-rgb,234,179,8),0.6)]'
                    : 'text-muted-foreground'
                }`} />
              </div>
              <span className="text-[9px] font-inter text-muted-foreground uppercase tracking-wider mt-1 block">{t('inspiration')}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
