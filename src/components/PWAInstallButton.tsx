import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
        title="Instalar aplicación PWA en el dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar PWA (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-cyan-300">Instalar PWA en iOS</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Toque el botón <strong>Compartir</strong> en la barra de Safari.<br /><br />
                2. Desplácese hacia abajo y seleccione <strong>Añadir a Pantalla de Inicio</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button for testing / manual prompt if needed
  return (
    <button
      onClick={() => alert('Para instalar la PWA, abra el menú de su navegador (Chrome/Edge/Safari) y seleccione "Instalar aplicación" o "Añadir a la pantalla de inicio".')}
      className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
      title="Información de instalación PWA"
    >
      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
      <span className="hidden sm:inline">Guía PWA</span>
    </button>
  );
};
