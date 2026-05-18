import React, { useState, useCallback, useEffect } from 'react';
import { listCharacters, getCharacter as fetchCharacter, updateCharacter, getCachedCharacters } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sword, BookOpen, ScrollText, User, Pencil, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

import CharacterHeader from '@/components/character/CharacterHeader';
import AbilityScore from '@/components/character/AbilityScore';
import SkillsList from '@/components/character/SkillsList';
import CombatStats from '@/components/character/CombatStats';
import TraitsPanel from '@/components/character/TraitsPanel';
import SpellsPanel from '@/components/character/SpellsPanel';
import CurrencyPanel from '@/components/character/CurrencyPanel';
import InventoryPanel from '@/components/character/InventoryPanel';
import EditModal from '@/components/character/EditModal';
import MagicParticles from '@/components/character/MagicParticles';
import CharacterMenu from '@/components/character/CharacterMenu';

export default function CharacterSheet({ onOpenSettings }) {
  const [editOpen, setEditOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [characterList, setCharacterList] = useState(getCachedCharacters());
  const [character, setCharacter] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadList = useCallback(async () => {
    try {
      const chars = await listCharacters();
      setCharacterList(chars);
      return chars;
    } catch (err) {
      toast.error('Error cargando personajes: ' + err.message);
      return characterList;
    }
  }, []);

  const loadCharacter = useCallback(async (id) => {
    if (!id) { setCharacter({}); return; }
    setLoading(true);
    try {
      const char = await fetchCharacter(id);
      setCharacter(char || {});
    } catch (err) {
      toast.error('Error cargando personaje: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      const chars = await loadList();
      const targetId = activeId || (chars.length > 0 ? chars[0].id : null);
      if (targetId) {
        setActiveId(targetId);
        await loadCharacter(targetId);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  // When activeId changes, load full character
  const handleSelectCharacter = async (id) => {
    setActiveId(id);
    if (id) await loadCharacter(id);
    else setCharacter({});
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadList();
    if (activeId) await loadCharacter(activeId);
    else setLoading(false);
  };

  const handleUpdate = async (data) => {
    if (!character.id) return;
    // Optimistic update
    setCharacter(prev => ({ ...prev, ...data }));
    try {
      await updateCharacter(character.id, data);
    } catch (err) {
      toast.error('Error guardando: ' + err.message);
      await loadCharacter(character.id); // revert
    }
  };

  const handleSaveEdit = async (data) => {
    if (!character.id) return;
    setSaving(true);
    try {
      await updateCharacter(character.id, data);
      setEditOpen(false);
      await loadList();
      await loadCharacter(character.id);
      toast.success('Personaje guardado');
    } catch (err) {
      toast.error('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateHP = (newHP) => handleUpdate({ hp_current: newHP });

  const handleToggleSlot = (level, index) => {
    const slots = { ...(character.spell_slots || {}) };
    const usedKey = `level_${level}_used`;
    const currentUsed = slots[usedKey] || 0;
    slots[usedKey] = index < currentUsed ? index : index + 1;
    handleUpdate({ spell_slots: slots });
  };

  const abilities = [
    { key: 'strength', label: 'FUE' },
    { key: 'dexterity', label: 'DES' },
    { key: 'constitution', label: 'CON' },
    { key: 'intelligence', label: 'INT' },
    { key: 'wisdom', label: 'SAB' },
    { key: 'charisma', label: 'CAR' },
  ];

  const saves = character.saving_throws || {};

  if (loading && characterList.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!character.id) {
    return (
      <div className="min-h-screen bg-background relative">
        <MagicParticles />
        <div className="absolute top-4 left-4 z-20">
          <CharacterMenu activeCharacterId={null} onSelect={handleSelectCharacter} onDataChange={loadList} />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sword className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-cinzel font-bold text-foreground">No hay personaje</h2>
            <p className="text-sm font-inter text-muted-foreground">
              Abre el menú (☰) para crear tu primer personaje.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MagicParticles />

      <div className="fixed top-4 left-4 z-20">
        <CharacterMenu
          activeCharacterId={character.id}
          onSelect={handleSelectCharacter}
          onDataChange={loadList}
        />
      </div>

      <div className="fixed top-4 right-4 z-20 flex gap-1">
        <Button variant="ghost" size="icon" onClick={handleRefresh}
          className="bg-card/80 border border-border text-foreground hover:bg-muted">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenSettings}
          className="bg-card/80 border border-border text-foreground hover:bg-muted">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pt-16">
        <div className="relative">
          <CharacterHeader character={character} />
          <Button
            onClick={() => setEditOpen(true)}
            size="sm"
            className="absolute top-3 right-3 gap-1.5 bg-primary/20 hover:bg-primary/30
              text-primary border border-primary/30 font-inter"
            variant="ghost"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Editar</span>
          </Button>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {abilities.map((a) => (
            <AbilityScore
              key={a.key}
              label={a.label}
              score={character[a.key] || 10}
              isProficientSave={saves[a.key] || false}
              profBonus={character.proficiency_bonus || 2}
            />
          ))}
        </div>

        <CurrencyPanel
          character={character}
          onUpdate={handleUpdate}
        />

        <InventoryPanel
          items={character.inventory || []}
          onChange={(inventory) => handleUpdate({ inventory })}
        />

        <Tabs defaultValue="combat" className="w-full">
          <TabsList className="w-full bg-card border border-border">
            <TabsTrigger value="combat" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Sword className="w-4 h-4" /><span className="hidden sm:inline">Combate</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <User className="w-4 h-4" /><span className="hidden sm:inline">Habilidades</span>
            </TabsTrigger>
            <TabsTrigger value="spells" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Conjuros</span>
            </TabsTrigger>
            <TabsTrigger value="traits" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <ScrollText className="w-4 h-4" /><span className="hidden sm:inline">Rasgos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combat" className="mt-4">
            <CombatStats character={character} onUpdateHP={handleUpdateHP} />
          </TabsContent>
          <TabsContent value="skills" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-inter font-semibold uppercase tracking-wider text-muted-foreground mb-3">Habilidades</h3>
              <SkillsList character={character} />
            </div>
          </TabsContent>
          <TabsContent value="spells" className="mt-4">
            <SpellsPanel character={character} onToggleSlot={handleToggleSlot} />
          </TabsContent>
          <TabsContent value="traits" className="mt-4">
            <TraitsPanel character={character} />
          </TabsContent>
        </Tabs>
      </div>

      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        character={character}
        onSave={handleSaveEdit}
        isSaving={saving}
      />
    </div>
  );
}
