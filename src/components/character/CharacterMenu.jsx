import React, { useState } from 'react';
import { createCharacter, deleteCharacter, getCachedCharacters } from '@/lib/storage';
import { useI18n } from '@/lib/i18n';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Plus, Trash2, User, Check, Loader2, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function CharacterMenu({ activeCharacterId, onSelect, onDataChange }) {
  const { t, lang, switchLang } = useI18n();
  const [newName, setNewName] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const characters = getCachedCharacters();

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const newChar = await createCharacter(newName.trim());
      onSelect(newChar.id);
      await onDataChange();
      setNewName('');
      toast.success(t('character_created'));
    } catch (err) {
      toast.error(t('error_creating') + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSelect = (id) => { onSelect(id); setOpen(false); };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm(t('delete_confirm'))) return;
    try {
      await deleteCharacter(id);
      if (id === activeCharacterId) {
        const remaining = characters.filter(c => c.id !== id);
        onSelect(remaining.length > 0 ? remaining[0].id : null);
      }
      await onDataChange();
      toast.success(t('character_deleted'));
    } catch (err) {
      toast.error(t('error_deleting') + err.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-card/80 border border-border text-foreground hover:bg-muted">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-card border-border text-foreground w-72">
        <SheetHeader>
          <SheetTitle className="font-cinzel text-primary text-lg">{t('characters')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {characters.map(c => (
            <div key={c.id} onClick={() => handleSelect(c.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group
                ${c.id === activeCharacterId ? 'bg-primary/20 border border-primary/40' : 'hover:bg-muted border border-transparent'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${c.id === activeCharacterId ? 'bg-primary/30' : 'bg-muted'}`}>
                {c.id === activeCharacterId ? <Check className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-cinzel text-sm text-foreground truncate">{c.name}</p>
                {c.class_level && <p className="text-xs text-muted-foreground font-inter truncate">{c.class_level}</p>}
              </div>
              <button onClick={(e) => handleDelete(e, c.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {characters.length === 0 && <p className="text-sm text-muted-foreground font-inter italic text-center py-4">{t('no_characters')}</p>}
        </div>
        <div className="mt-6 border-t border-border pt-4 space-y-2">
          <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider">{t('new_character')}</p>
          <div className="flex gap-2">
            <Input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder={t('name_placeholder')} className="bg-muted border-border text-foreground font-inter text-sm" />
            <Button onClick={handleCreate} disabled={creating || !newName.trim()} size="icon"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 flex-shrink-0" variant="ghost">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-inter text-muted-foreground uppercase tracking-wider mb-2">{t('language')}</p>
          <div className="flex gap-2">
            <Button size="sm" variant={lang === 'es' ? 'default' : 'outline'}
              onClick={() => switchLang('es')}
              className={`flex-1 text-xs font-inter gap-1.5 ${lang === 'es' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
              <Globe className="w-3.5 h-3.5" /> Español
            </Button>
            <Button size="sm" variant={lang === 'en' ? 'default' : 'outline'}
              onClick={() => switchLang('en')}
              className={`flex-1 text-xs font-inter gap-1.5 ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>
              <Globe className="w-3.5 h-3.5" /> English
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
