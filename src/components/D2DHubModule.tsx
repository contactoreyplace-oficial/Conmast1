import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Share2, Wifi, Radio, Smartphone, ArrowRightLeft, Send, CheckCircle2, RefreshCw } from 'lucide-react';

export const D2DHubModule: React.FC = () => {
  const { devices, activeDeviceId } = useIoT();
  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];

  const [mode, setMode] = useState<'repeater' | 'modem' | 'transfer' | 'mesh'>('repeater');
  const [targetDevice, setTargetDevice] = useState(devices[1]?.id || 'dev-2');
  const [transferFile, setTransferFile] = useState('firmware_v2.5_update.bin');
  const [successMsg, setSuccessMsg] = useState('');
  const [transferring, setTransferring] = useState(false);

  const handleExecuteD2D = (actionName: string) => {
    setTransferring(true);
    setTimeout(() => {
      setTransferring(false);
      setSuccessMsg(`¡Operación "${actionName}" completada con éxito entre dispositivos!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-cyan-400" />
            <span>Centro de Conexión Dispositivo a Dispositivo (D2D & Mesh)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Control total D2D, transferencia de archivos binarios, función de módem celular compartido, repetidor Wi-Fi y puente mesh entre equipos conectados.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
      </div>

      {/* Mode Selection Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setMode('repeater')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            mode === 'repeater' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Wifi className={`w-5 h-5 ${mode === 'repeater' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Modo Repetidor Wi-Fi</span>
            <span className="text-[10px] text-slate-400">Extensión de cobertura</span>
          </div>
        </button>

        <button
          onClick={() => setMode('modem')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            mode === 'modem' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Radio className={`w-5 h-5 ${mode === 'modem' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Opción de Módem / Hotspot</span>
            <span className="text-[10px] text-slate-400">Compartir datos LTE/5G</span>
          </div>
        </button>

        <button
          onClick={() => setMode('transfer')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            mode === 'transfer' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <ArrowRightLeft className={`w-5 h-5 ${mode === 'transfer' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Transferencia D2D</span>
            <span className="text-[10px] text-slate-400">Envío de firmware y datos</span>
          </div>
        </button>

        <button
          onClick={() => setMode('mesh')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            mode === 'mesh' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${mode === 'mesh' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Puente Mesh Completo</span>
            <span className="text-[10px] text-slate-400">Red descentralizada</span>
          </div>
        </button>
      </div>

      {/* Mode Content */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        {mode === 'repeater' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span>Configuración de Modo Repetidor y Amplificador de Señal</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Convierte este dispositivo en un repetidor Wi-Fi activo para retransmitir paquetes MQTT y telemetría hacia nodos IoT distantes en zonas de sombra.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">SSID Repetido: IoT_Nexus_Mesh_Extender</span>
                <span className="text-slate-400">Canal 6 (2.4GHz) • Potencia de Transmisión: +20dBm</span>
              </div>
              <button
                onClick={() => handleExecuteD2D('Activación de Modo Repetidor')}
                disabled={transferring}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
              >
                {transferring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                <span>Activar Repetidor</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'modem' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Opción de Módem / Compartir Conexión Celular</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comparte la conexión de datos móviles (LTE/5G) del dispositivo con otros nodos IoT cercanos mediante un punto de acceso cifrado WPA3.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">Hotspot LTE: IoT_Cellular_Gateway_01</span>
                <span className="text-slate-400">Seguridad: WPA3-Enterprise • IP Gateway: 192.168.4.1</span>
              </div>
              <button
                onClick={() => handleExecuteD2D('Compartir Módem Cellular')}
                disabled={transferring}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors flex items-center space-x-2"
              >
                {transferring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                <span>Iniciar Hotspot Módem</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'transfer' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span>Transferencia Directa Dispositivo a Dispositivo (D2D)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Dispositivo Destino</label>
                <select
                  value={targetDevice}
                  onChange={e => setTargetDevice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.connectionType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Archivo / Paquete a Transferir</label>
                <input
                  type="text"
                  value={transferFile}
                  onChange={e => setTransferFile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => handleExecuteD2D(`Transferencia D2D de ${transferFile}`)}
              disabled={transferring}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center space-x-2"
            >
              {transferring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Iniciar Transferencia D2D Segura</span>
            </button>
          </div>
        )}

        {mode === 'mesh' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Red Mesh Descentralizada (Multi-Hop Routing)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permite enrutar paquetes de telemetría a través de múltiples nodos intermedios cuando el nodo principal está fuera del rango del broker central.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">Topología Mesh: Dinámica (AODV Protocol)</span>
                <span className="text-slate-400">Saltos máximos permitidos: 6 • Nodos en malla: {devices.length}</span>
              </div>
              <span className="text-emerald-400 font-semibold">● Red Mesh Sincronizada</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
