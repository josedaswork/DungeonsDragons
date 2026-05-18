import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save } from 'lucide-react';

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        placeholder={placeholder}
        className="bg-muted border-border text-foreground font-inter"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{label}</Label>
      <Textarea
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-muted border-border text-foreground font-inter resize-none"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-inter text-foreground">{label}</span>
      <Switch checked={!!checked} onCheckedChange={onChange} />
    </div>
  );
}

function SpellListEditor({ label, spells = [], onChange }) {
  const [newSpell, setNewSpell] = useState('');

  const add = () => {
    if (!newSpell.trim()) return;
    onChange([...spells, newSpell.trim()]);
    setNewSpell('');
  };

  const remove = (i) => onChange(spells.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{label}</Label>
      <div className="space-y-1">
        {spells.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={s}
              onChange={e => {
                const arr = [...spells];
                arr[i] = e.target.value;
                onChange(arr);
              }}
              className="bg-muted border-border text-foreground font-inter text-sm"
            />
            <Button variant="ghost" size="icon" onClick={() => remove(i)} className="text-destructive hover:text-destructive flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newSpell}
          onChange={e => setNewSpell(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={`Añadir ${label.toLowerCase()}...`}
          className="bg-muted border-border text-foreground font-inter text-sm"
        />
        <Button variant="outline" size="icon" onClick={add} className="border-primary/40 text-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

const SKILLS_LIST = [
  { key: 'acrobatics', label: 'Acrobacias' },
  { key: 'animal_handling', label: 'T. con Animales' },
  { key: 'arcana', label: 'Arcano' },
  { key: 'athletics', label: 'Atletismo' },
  { key: 'deception', label: 'Engaño' },
  { key: 'history', label: 'Historia' },
  { key: 'insight', label: 'Perspicacia' },
  { key: 'intimidation', label: 'Intimidación' },
  { key: 'investigation', label: 'Investigación' },
  { key: 'sleight_of_hand', label: 'Juego de Manos' },
  { key: 'medicine', label: 'Medicina' },
  { key: 'nature', label: 'Naturaleza' },
  { key: 'perception', label: 'Percepción' },
  { key: 'persuasion', label: 'Persuasión' },
  { key: 'religion', label: 'Religión' },
  { key: 'stealth', label: 'Sigilo' },
  { key: 'survival', label: 'Supervivencia' },
];

const SAVES_LIST = [
  { key: 'strength', label: 'Fuerza' },
  { key: 'dexterity', label: 'Destreza' },
  { key: 'constitution', label: 'Constitución' },
  { key: 'intelligence', label: 'Inteligencia' },
  { key: 'wisdom', label: 'Sabiduría' },
  { key: 'charisma', label: 'Carisma' },
];

export default function EditModal({ open, onClose, character, onSave, isSaving }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (character) setForm(JSON.parse(JSON.stringify(character)));
  }, [character, open]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNested = (parent, key, val) =>
    setForm(f => ({ ...f, [parent]: { ...(f[parent] || {}), [key]: val } }));

  const handleSave = () => {
    const cleaned = { ...form };
    ['strength','dexterity','constitution','intelligence','wisdom','charisma',
     'proficiency_bonus','armor_class','initiative','speed','hp_max','hp_current',
     'hp_temp','passive_perception','spell_save_dc','spell_attack_bonus',
     'gold','silver','copper','electrum','platinum'].forEach(k => {
      if (cleaned[k] === '') cleaned[k] = null;
    });
    onSave(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl text-primary">Editar Personaje</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full mt-2">
          <TabsList className="w-full bg-muted border border-border flex-wrap h-auto gap-1 p-1">
            {['info','stats','combat','skills','spells','traits','monedas'].map(t => (
              <TabsTrigger key={t} value={t}
                className="text-xs capitalize data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {t === 'info' ? 'Info' : t === 'stats' ? 'Atributos' : t === 'combat' ? 'Combate'
                  : t === 'skills' ? 'Habilidades' : t === 'spells' ? 'Conjuros'
                  : t === 'traits' ? 'Rasgos' : 'Monedas'}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="info" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" value={form.name} onChange={v => set('name', v)} />
              <Field label="Clase y Nivel" value={form.class_level} onChange={v => set('class_level', v)} placeholder="Brujo 1" />
              <Field label="Raza" value={form.race} onChange={v => set('race', v)} />
              <Field label="Trasfondo" value={form.background} onChange={v => set('background', v)} />
              <Field label="Alineamiento" value={form.alignment} onChange={v => set('alignment', v)} />
              <Field label="Puntos de Experiencia" value={form.experience} onChange={v => set('experience', v)} />
              <Field label="Nombre del Jugador" value={form.player_name} onChange={v => set('player_name', v)} />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border mt-2">
              <span className="text-sm font-inter text-foreground">Inspiración</span>
              <Switch checked={!!form.inspiration} onCheckedChange={v => set('inspiration', v)} />
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-3 mt-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'strength', label: 'Fuerza' },
                { key: 'dexterity', label: 'Destreza' },
                { key: 'constitution', label: 'Constitución' },
                { key: 'intelligence', label: 'Inteligencia' },
                { key: 'wisdom', label: 'Sabiduría' },
                { key: 'charisma', label: 'Carisma' },
              ].map(a => (
                <Field key={a.key} label={a.label} value={form[a.key]} type="number"
                  onChange={v => set(a.key, v)} />
              ))}
            </div>
            <Field label="Bonificador de Competencia" value={form.proficiency_bonus} type="number"
              onChange={v => set('proficiency_bonus', v)} />
            <div className="border-t border-border pt-3">
              <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">Tiradas de Salvación (Competencia)</p>
              {SAVES_LIST.map(s => (
                <Toggle key={s.key} label={s.label}
                  checked={(form.saving_throws || {})[s.key]}
                  onChange={v => setNested('saving_throws', s.key, v)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combat" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Clase de Armadura" value={form.armor_class} type="number" onChange={v => set('armor_class', v)} />
              <Field label="Iniciativa" value={form.initiative} type="number" onChange={v => set('initiative', v)} />
              <Field label="Velocidad (ft)" value={form.speed} type="number" onChange={v => set('speed', v)} />
              <Field label="PG Máximos" value={form.hp_max} type="number" onChange={v => set('hp_max', v)} />
              <Field label="PG Actuales" value={form.hp_current} type="number" onChange={v => set('hp_current', v)} />
              <Field label="PG Temporales" value={form.hp_temp} type="number" onChange={v => set('hp_temp', v)} />
              <Field label="Dados de Golpe" value={form.hit_dice} onChange={v => set('hit_dice', v)} placeholder="1d8" />
              <Field label="Percepción Pasiva" value={form.passive_perception} type="number" onChange={v => set('passive_perception', v)} />
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-1 mt-4">
            <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">Competencias en Habilidades</p>
            {SKILLS_LIST.map(s => (
              <Toggle key={s.key} label={s.label}
                checked={(form.skills || {})[s.key]}
                onChange={v => setNested('skills', s.key, v)} />
            ))}
            <div className="pt-3 border-t border-border">
              <TextareaField label="Otras Competencias e Idiomas" value={form.other_proficiencies}
                onChange={v => set('other_proficiencies', v)} />
            </div>
          </TabsContent>

          <TabsContent value="spells" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Clase Lanzadora" value={form.spellcasting_class} onChange={v => set('spellcasting_class', v)} />
              <Field label="Aptitud Mágica" value={form.spellcasting_ability} onChange={v => set('spellcasting_ability', v)} placeholder="CAR" />
              <Field label="CD Salvación" value={form.spell_save_dc} type="number" onChange={v => set('spell_save_dc', v)} />
              <Field label="Bonif. Ataque" value={form.spell_attack_bonus} type="number" onChange={v => set('spell_attack_bonus', v)} />
            </div>
            <div className="border-t border-border pt-3 space-y-1">
              <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">Espacios de Conjuro</p>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3].map(lvl => (
                  <React.Fragment key={lvl}>
                    <Field label={`Nivel ${lvl} - Total`}
                      value={(form.spell_slots || {})[`level_${lvl}_total`]}
                      type="number"
                      onChange={v => setNested('spell_slots', `level_${lvl}_total`, v)} />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-4">
              <SpellListEditor label="Trucos" spells={form.cantrips || []} onChange={v => set('cantrips', v)} />
              <SpellListEditor label="Conjuros Nivel 1" spells={form.spells_level_1 || []} onChange={v => set('spells_level_1', v)} />
              <SpellListEditor label="Conjuros Nivel 2" spells={form.spells_level_2 || []} onChange={v => set('spells_level_2', v)} />
              <SpellListEditor label="Conjuros Nivel 3" spells={form.spells_level_3 || []} onChange={v => set('spells_level_3', v)} />
            </div>
          </TabsContent>

          <TabsContent value="traits" className="space-y-3 mt-4">
            <TextareaField label="Rasgos y Atributos" value={form.traits} onChange={v => set('traits', v)} rows={5} />
            <TextareaField label="Rasgos de Personalidad" value={form.personality_traits} onChange={v => set('personality_traits', v)} />
            <TextareaField label="Ideales" value={form.ideals} onChange={v => set('ideals', v)} />
            <TextareaField label="Vínculos" value={form.bonds} onChange={v => set('bonds', v)} />
            <TextareaField label="Defectos" value={form.flaws} onChange={v => set('flaws', v)} />
            <TextareaField label="Equipo" value={form.equipment} onChange={v => set('equipment', v)} rows={4} />
          </TabsContent>

          <TabsContent value="monedas" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Platino (PPL)" value={form.platinum} type="number" onChange={v => set('platinum', v)} />
              <Field label="Oro (PO)" value={form.gold} type="number" onChange={v => set('gold', v)} />
              <Field label="Electro (PE)" value={form.electrum} type="number" onChange={v => set('electrum', v)} />
              <Field label="Plata (PP)" value={form.silver} type="number" onChange={v => set('silver', v)} />
              <Field label="Cobre (PC)" value={form.copper} type="number" onChange={v => set('copper', v)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={onClose} className="font-inter border-border">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-inter gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
