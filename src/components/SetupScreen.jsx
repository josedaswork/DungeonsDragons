import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sword, ExternalLink, CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import { pingServer, setScriptUrl, getScriptUrl } from '@/lib/storage';
import scriptCode from '@/../Files/google-apps-script.js?raw';

export default function SetupScreen({ onSave, initialUrl }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    if (!url.trim()) {
      setError('Introduce la URL del script');
      return;
    }

    setTesting(true);
    setError('');

    try {
      // Temporarily set URL so pingServer can use it
      setScriptUrl(url.trim());
      await pingServer();
      onSave(url.trim());
    } catch (err) {
      setError('Error conectando: ' + err.message);
      // Restore previous URL if test fails
      setScriptUrl(initialUrl || '');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Sword className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-cinzel font-bold text-foreground">D&D Character Tracker</h1>
          <p className="text-sm font-inter text-muted-foreground">
            Conecta tu Google Spreadsheet para guardar tus personajes en la nube.
          </p>
        </div>

        <div className="space-y-4 bg-card rounded-xl border border-border p-6">
          <div className="space-y-2">
            <label className="text-xs font-inter text-muted-foreground uppercase tracking-wider">
              URL del Google Apps Script
            </label>
            <Input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              placeholder="https://script.google.com/macros/s/..."
              className="bg-muted border-border text-foreground font-inter text-sm"
            />
            {error && <p className="text-xs text-destructive font-inter">{error}</p>}
          </div>

          <Button
            onClick={handleTest}
            disabled={testing || !url.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-inter gap-2"
          >
            {testing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Conectando...</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Conectar y Guardar</>
            )}
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-xs font-inter font-semibold uppercase tracking-wider text-muted-foreground">Instrucciones</h3>
          <ol className="text-xs font-inter text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Crea una nueva Google Spreadsheet</li>
            <li>Ve a <strong>Extensiones → Apps Script</strong></li>
            <li>Copia el código con el botón de abajo y pégalo en el editor</li>
            <li>Despliega como <strong>Aplicación web</strong> (acceso: cualquier persona)</li>
            <li>Copia la URL y pégala arriba</li>
          </ol>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full gap-2 text-xs font-inter border-border text-foreground hover:bg-muted"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 text-green-400" /> Código copiado</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copiar código de Google Apps Script</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
