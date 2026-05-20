import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Wand2, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

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

/* ---- Spell helpers ---- */
/** Normalize any spell format into a structured object.
 *  Handles: plain string, {name,desc} with JSON in desc, {name,...structured} */
function normalizeSpell(s) {
  if (typeof s === 'string') return { name: s };
  if (!s) return { name: '' };
  const result = { ...s };
  // If 'desc' contains JSON (from old server writing JSON to col B as plain desc), parse it
  if (result.desc && typeof result.desc === 'string' && !result.type && !result.casting_time && !result.description) {
    try {
      const parsed = JSON.parse(result.desc);
      if (typeof parsed === 'object' && parsed !== null) {
        Object.assign(result, parsed);
        delete result.desc;
      }
    } catch { /* not JSON, keep as legacy description */ }
  }
  // Migrate legacy 'desc' to 'description'
  if (result.desc && !result.description) {
    result.description = result.desc;
    delete result.desc;
  }
  return result;
}

/* ---- Spell Editor Dialog ---- */
function SpellEditorDialog({ spell, open, onClose, onSave }) {
  const { t } = useI18n();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (open && spell) {
      const s = normalizeSpell(spell);
      setForm({
        name: s.name || '',
        type: s.type || '',
        casting_time: s.casting_time || '',
        range: s.range || '',
        range_unit: s.range_unit || 'feet',
        comp_v: s.comp_v || false,
        comp_s: s.comp_s || false,
        comp_m: s.comp_m || false,
        material_desc: s.material_desc || '',
        duration: s.duration || '',
        classes: s.classes || '',
        description: s.description || s.desc || '',
        higher_levels: s.higher_levels || '',
      });
    }
  }, [open, spell]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    const cleaned = { name: form.name };
    if (form.type) cleaned.type = form.type;
    if (form.casting_time) cleaned.casting_time = form.casting_time;
    if (form.range) cleaned.range = form.range;
    if (form.range !== '' && form.range_unit) cleaned.range_unit = form.range_unit;
    if (form.comp_v) cleaned.comp_v = true;
    if (form.comp_s) cleaned.comp_s = true;
    if (form.comp_m) cleaned.comp_m = true;
    if (form.comp_m && form.material_desc) cleaned.material_desc = form.material_desc;
    if (form.duration) cleaned.duration = form.duration;
    if (form.classes) cleaned.classes = form.classes;
    if (form.description) cleaned.description = form.description;
    if (form.higher_levels) cleaned.higher_levels = form.higher_levels;
    onSave(cleaned);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-md mx-auto rounded-xl max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-primary text-base flex items-center gap-2">
            <Wand2 className="w-4 h-4" /> {t('edit_spell')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('name')}</Label>
            <Input value={form.name || ''} onChange={e => set('name', e.target.value)}
              className="bg-muted border-border text-foreground font-inter text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('spell_type')}</Label>
            <Input value={form.type || ''} onChange={e => set('type', e.target.value)}
              placeholder={t('spell_type_placeholder')}
              className="bg-muted border-border text-foreground font-inter text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('casting_time')}</Label>
            <Input value={form.casting_time || ''} onChange={e => set('casting_time', e.target.value)}
              placeholder={t('casting_time_placeholder')}
              className="bg-muted border-border text-foreground font-inter text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('spell_range')}</Label>
            <div className="flex gap-2">
              <Input value={form.range || ''} onChange={e => set('range', e.target.value)}
                placeholder={t('spell_range_placeholder')}
                className="bg-muted border-border text-foreground font-inter text-sm flex-1" />
              <select value={form.range_unit || 'feet'} onChange={e => set('range_unit', e.target.value)}
                className="bg-muted border border-border text-foreground font-inter text-xs rounded-md px-2">
                <option value="feet">{t('range_feet')}</option>
                <option value="meters">{t('range_meters')}</option>
                <option value="self">{t('range_self')}</option>
                <option value="touch">{t('range_touch')}</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('components')}</Label>
            <div className="flex gap-3">
              {[['comp_v', 'V'], ['comp_s', 'S'], ['comp_m', 'M']].map(([key, lbl]) => (
                <button key={key} onClick={() => set(key, !form[key])}
                  className={`px-3 py-1.5 rounded-md border text-xs font-inter font-semibold transition-colors ${form[key] ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted border-border text-muted-foreground'}`}>
                  {lbl}
                </button>
              ))}
            </div>
            {form.comp_m && (
              <Input value={form.material_desc || ''} onChange={e => set('material_desc', e.target.value)}
                placeholder={t('material_desc')}
                className="bg-muted border-border text-foreground font-inter text-xs mt-1" />
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('spell_duration')}</Label>
            <Input value={form.duration || ''} onChange={e => set('duration', e.target.value)}
              placeholder={t('spell_duration_placeholder')}
              className="bg-muted border-border text-foreground font-inter text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('spell_classes')}</Label>
            <Input value={form.classes || ''} onChange={e => set('classes', e.target.value)}
              placeholder={t('spell_classes_placeholder')}
              className="bg-muted border-border text-foreground font-inter text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('spell_text')}</Label>
            <Textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
              rows={4} className="bg-muted border-border text-foreground font-inter text-xs resize-none" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('higher_levels')}</Label>
            <Textarea value={form.higher_levels || ''} onChange={e => set('higher_levels', e.target.value)}
              placeholder={t('higher_levels_placeholder')}
              rows={2} className="bg-muted border-border text-foreground font-inter text-xs resize-none" />
          </div>
          <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-inter gap-2">
            <Save className="w-4 h-4" /> {t('save_changes')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SpellListEditor({ label, spells = [], onChange }) {
  const { t } = useI18n();
  const [newSpell, setNewSpell] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);

  const getName = (s) => typeof s === 'object' ? s.name : s;
  const hasDetails = (s) => {
    const n = normalizeSpell(s);
    return !!(n.type || n.casting_time || n.range || n.description || n.higher_levels);
  };

  const add = () => {
    if (!newSpell.trim()) return;
    onChange([...spells, { name: newSpell.trim() }]);
    setNewSpell('');
  };

  const remove = (i) => onChange(spells.filter((_, idx) => idx !== i));

  const updateSpell = (i, updated) => {
    const arr = [...spells];
    arr[i] = updated;
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{label}</Label>
      <div className="space-y-1">
        {spells.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-muted border border-border rounded-md px-3 py-1.5">
              <Wand2 className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-sm font-inter text-foreground flex-1 truncate">{getName(s)}</span>
              {hasDetails(s) && <span className="text-[10px] text-primary/60">ⓘ</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingIdx(i)}
              className="text-muted-foreground hover:text-primary flex-shrink-0">
              <Wand2 className="w-4 h-4" />
            </Button>
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
          placeholder={`${t('add_spell_desc').split('...')[0]}...`}
          className="bg-muted border-border text-foreground font-inter text-sm"
        />
        <Button variant="outline" size="icon" onClick={add} className="border-primary/40 text-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {editingIdx !== null && (
        <SpellEditorDialog
          spell={spells[editingIdx]}
          open={true}
          onClose={() => setEditingIdx(null)}
          onSave={(updated) => updateSpell(editingIdx, updated)}
        />
      )}
    </div>
  );
}

function FeatureListEditor({ features = [], onChange }) {
  const { t } = useI18n();
  const [newTitle, setNewTitle] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);

  const add = () => {
    if (!newTitle.trim()) return;
    onChange([...features, { title: newTitle.trim(), description: '' }]);
    setNewTitle('');
  };

  const remove = (i) => onChange(features.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    const arr = [...features];
    arr[i] = { ...arr[i], [field]: value };
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('class_features')}</Label>
      {features.map((f, i) => (
        <div key={i} className="bg-muted/50 rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <Input value={f.title || ''} onChange={e => update(i, 'title', e.target.value)}
              placeholder={t('feature_title')}
              className="bg-muted border-border text-foreground font-inter text-sm flex-1" />
            <Button variant="ghost" size="icon" onClick={() => remove(i)} className="text-destructive hover:text-destructive flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Textarea value={f.description || ''} onChange={e => update(i, 'description', e.target.value)}
            placeholder={t('feature_description')}
            className="bg-muted border-border text-foreground font-inter text-sm" rows={2} />
        </div>
      ))}
      <div className="flex gap-2">
        <Input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={t('add_feature')}
          className="bg-muted border-border text-foreground font-inter text-sm" />
        <Button variant="outline" size="icon" onClick={add} className="border-primary/40 text-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

const SKILLS_LIST = [
  { key: 'acrobatics', labelKey: 'skill_acrobatics' },
  { key: 'animal_handling', labelKey: 'skill_animal_handling' },
  { key: 'arcana', labelKey: 'skill_arcana' },
  { key: 'athletics', labelKey: 'skill_athletics' },
  { key: 'deception', labelKey: 'skill_deception' },
  { key: 'history', labelKey: 'skill_history' },
  { key: 'insight', labelKey: 'skill_insight' },
  { key: 'intimidation', labelKey: 'skill_intimidation' },
  { key: 'investigation', labelKey: 'skill_investigation' },
  { key: 'sleight_of_hand', labelKey: 'skill_sleight_of_hand' },
  { key: 'medicine', labelKey: 'skill_medicine' },
  { key: 'nature', labelKey: 'skill_nature' },
  { key: 'perception', labelKey: 'skill_perception' },
  { key: 'performance', labelKey: 'skill_performance' },
  { key: 'persuasion', labelKey: 'skill_persuasion' },
  { key: 'religion', labelKey: 'skill_religion' },
  { key: 'stealth', labelKey: 'skill_stealth' },
  { key: 'survival', labelKey: 'skill_survival' },
];

const SAVES_LIST = [
  { key: 'strength', labelKey: 'ability_strength' },
  { key: 'dexterity', labelKey: 'ability_dexterity' },
  { key: 'constitution', labelKey: 'ability_constitution' },
  { key: 'intelligence', labelKey: 'ability_intelligence' },
  { key: 'wisdom', labelKey: 'ability_wisdom' },
  { key: 'charisma', labelKey: 'ability_charisma' },
];

export default function EditModal({ open, onClose, character, onSave, isSaving }) {
  const { t } = useI18n();
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
          <DialogTitle className="font-cinzel text-xl text-primary">{t('edit_character')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full mt-2">
          <TabsList className="w-full bg-muted border border-border flex-wrap h-auto gap-1 p-1">
            {[
              { value: 'info', label: t('tab_info') },
              { value: 'stats', label: t('tab_attributes') },
              { value: 'combat', label: t('tab_combat') },
              { value: 'skills', label: t('tab_skills') },
              { value: 'spells', label: t('tab_spells') },
              { value: 'traits', label: t('tab_traits') },
              { value: 'features', label: t('tab_features') },
              { value: 'monedas', label: t('tab_coins') },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="info" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('name')} value={form.name} onChange={v => set('name', v)} />
              <Field label={t('class_and_level')} value={form.class_level} onChange={v => set('class_level', v)} placeholder="Brujo 1" />
              <Field label={t('race')} value={form.race} onChange={v => set('race', v)} />
              <Field label={t('background')} value={form.background} onChange={v => set('background', v)} />
              <Field label={t('alignment')} value={form.alignment} onChange={v => set('alignment', v)} />
              <Field label={t('experience')} value={form.experience} onChange={v => set('experience', v)} />
              <Field label={t('player_name')} value={form.player_name} onChange={v => set('player_name', v)} />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border mt-2">
              <span className="text-sm font-inter text-foreground">{t('inspiration')}</span>
              <Switch checked={!!form.inspiration} onCheckedChange={v => set('inspiration', v)} />
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-3 mt-4">
            <div className="grid grid-cols-3 gap-3">
              {SAVES_LIST.map(a => (
                <Field key={a.key} label={t(a.labelKey)} value={form[a.key]} type="number"
                  onChange={v => set(a.key, v)} />
              ))}
            </div>
            <Field label={t('proficiency_bonus')} value={form.proficiency_bonus} type="number"
              onChange={v => set('proficiency_bonus', v)} />
            <div className="border-t border-border pt-3">
              <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">{t('saving_throws_proficiency')}</p>
              {SAVES_LIST.map(s => (
                <Toggle key={s.key} label={t(s.labelKey)}
                  checked={(form.saving_throws || {})[s.key]}
                  onChange={v => setNested('saving_throws', s.key, v)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combat" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('armor_class')} value={form.armor_class} type="number" onChange={v => set('armor_class', v)} />
              <Field label={t('initiative')} value={form.initiative} type="number" onChange={v => set('initiative', v)} />
              <Field label={t('speed_ft')} value={form.speed} type="number" onChange={v => set('speed', v)} />
              <Field label={t('hp_max')} value={form.hp_max} type="number" onChange={v => set('hp_max', v)} />
              <Field label={t('hp_current')} value={form.hp_current} type="number" onChange={v => set('hp_current', v)} />
              <Field label={t('hp_temp')} value={form.hp_temp} type="number" onChange={v => set('hp_temp', v)} />
              <Field label={t('hit_dice')} value={form.hit_dice} onChange={v => set('hit_dice', v)} placeholder="1d8" />
              <Field label={t('passive_perception')} value={form.passive_perception} type="number" onChange={v => set('passive_perception', v)} />
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-1 mt-4">
            <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">{t('skill_proficiencies')}</p>
            {SKILLS_LIST.map(s => (
              <Toggle key={s.key} label={t(s.labelKey)}
                checked={(form.skills || {})[s.key]}
                onChange={v => setNested('skills', s.key, v)} />
            ))}
            <div className="pt-3 border-t border-border">
              <TextareaField label={t('other_proficiencies')} value={form.other_proficiencies}
                onChange={v => set('other_proficiencies', v)} />
            </div>
          </TabsContent>

          <TabsContent value="spells" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label={t('spellcasting_class')} value={form.spellcasting_class} onChange={v => set('spellcasting_class', v)} />
              <Field label={t('spellcasting_ability')} value={form.spellcasting_ability} onChange={v => set('spellcasting_ability', v)} placeholder="CAR" />
              <Field label={t('spell_save_dc')} value={form.spell_save_dc} type="number" onChange={v => set('spell_save_dc', v)} />
              <Field label={t('spell_attack_bonus')} value={form.spell_attack_bonus} type="number" onChange={v => set('spell_attack_bonus', v)} />
            </div>
            <div className="border-t border-border pt-3 space-y-1">
              <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">{t('spell_slots')}</p>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3].map(lvl => (
                  <React.Fragment key={lvl}>
                    <Field label={`${t('level')} ${lvl} - ${t('level_total')}`}
                      value={(form.spell_slots || {})[`level_${lvl}_total`]}
                      type="number"
                      onChange={v => setNested('spell_slots', `level_${lvl}_total`, v)} />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-4">
              <SpellListEditor label={t('cantrips')} spells={form.cantrips || []} onChange={v => set('cantrips', v)} addPlaceholder={`${t('add_cantrips')}`} />
              <SpellListEditor label={`${t('spells_level')} 1`} spells={form.spells_level_1 || []} onChange={v => set('spells_level_1', v)} addPlaceholder={`${t('add_spells_level')} 1...`} />
              <SpellListEditor label={`${t('spells_level')} 2`} spells={form.spells_level_2 || []} onChange={v => set('spells_level_2', v)} addPlaceholder={`${t('add_spells_level')} 2...`} />
              <SpellListEditor label={`${t('spells_level')} 3`} spells={form.spells_level_3 || []} onChange={v => set('spells_level_3', v)} addPlaceholder={`${t('add_spells_level')} 3...`} />
            </div>
          </TabsContent>

          <TabsContent value="traits" className="space-y-3 mt-4">
            <TextareaField label={t('traits_and_features')} value={form.traits} onChange={v => set('traits', v)} rows={5} />
            <TextareaField label={t('personality_traits')} value={form.personality_traits} onChange={v => set('personality_traits', v)} />
            <TextareaField label={t('ideals')} value={form.ideals} onChange={v => set('ideals', v)} />
            <TextareaField label={t('bonds')} value={form.bonds} onChange={v => set('bonds', v)} />
            <TextareaField label={t('flaws')} value={form.flaws} onChange={v => set('flaws', v)} />
            <TextareaField label={t('equipment')} value={form.equipment} onChange={v => set('equipment', v)} rows={4} />
          </TabsContent>

          <TabsContent value="features" className="space-y-3 mt-4">
            <FeatureListEditor features={form.features || []} onChange={v => set('features', v)} />
          </TabsContent>

          <TabsContent value="monedas" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={`${t('platinum')} (${t('platinum_abbr')})`} value={form.platinum} type="number" onChange={v => set('platinum', v)} />
              <Field label={`${t('gold')} (${t('gold_abbr')})`} value={form.gold} type="number" onChange={v => set('gold', v)} />
              <Field label={`${t('electrum')} (${t('electrum_abbr')})`} value={form.electrum} type="number" onChange={v => set('electrum', v)} />
              <Field label={`${t('silver')} (${t('silver_abbr')})`} value={form.silver} type="number" onChange={v => set('silver', v)} />
              <Field label={`${t('copper')} (${t('copper_abbr')})`} value={form.copper} type="number" onChange={v => set('copper', v)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={onClose} className="font-inter border-border">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-inter gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t('saving') : t('save_changes')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
