import React, { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function InventoryPanel({ items = [], onChange }) {
  const { t } = useI18n();
  const [newItem, setNewItem] = useState('');

  const add = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem('');
  };

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  const edit = (i, val) => {
    const updated = [...items];
    updated[i] = val;
    onChange(updated);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-inter font-semibold uppercase tracking-wider text-muted-foreground">{t('inventory')}</h3>
        <span className="ml-auto text-xs text-muted-foreground">{items.length} {t('items_count')}</span>
      </div>
      <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
        {items.length === 0 && <p className="text-sm text-muted-foreground font-inter italic text-center py-3">{t('no_items')}</p>}
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <span className="text-muted-foreground text-xs w-3 flex-shrink-0">·</span>
            <input value={item} onChange={e => edit(i, e.target.value)}
              className="flex-1 bg-transparent text-sm font-inter text-foreground border-b border-transparent focus:border-primary/50 outline-none py-0.5 transition-colors" />
            <button onClick={() => remove(i)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border pt-3">
        <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={t('add_item')}
          className="flex-1 bg-muted border border-border rounded px-3 py-1.5 text-sm font-inter text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors" />
        <button onClick={add} className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded px-3 py-1.5 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
