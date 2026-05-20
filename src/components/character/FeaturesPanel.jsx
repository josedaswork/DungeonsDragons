import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';

export default function FeaturesPanel({ features = [] }) {
  const { t } = useI18n();

  if (!features || features.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 text-center">
        <p className="text-sm font-inter text-muted-foreground">{t('no_features')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h4 className="text-sm font-cinzel font-semibold text-primary">{feature.title}</h4>
          </div>
          {feature.description && (
            <p className="text-sm font-inter text-foreground leading-relaxed whitespace-pre-wrap pl-5.5">
              {feature.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
