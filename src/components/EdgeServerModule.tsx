import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Database, Play, Square, Activity, Wifi, Shield, CheckCircle2 } from 'lucide-react';

export const EdgeServerModule: React.FC = () => {
  const [serverRunning, setServerRunning] = useState(true);
  const [ramAllocated, setRamAllocated] = useState(512); // MB
  const [storageCache, setStorageCache] = useState(2.4); // GB
  const [activeClients, setActiveClients] = useState(7);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <Server className="w-6 h-6 text-cyan-400" />
            <span>Servidor Local Edge (Modo Dispositivo Antiguo)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Utilice un dispositivo móvil o tablet antiguo como servidor local de borde (Edge Server), aprovechando su CPU, memoria RAM, ROM y almacenamiento para procesamiento descentralizado.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
      </div>

      {/* Server Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-2xl ${serverRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Estado del Servidor Edge Local</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${serverRunning ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35' : 'bg-rose-500/20 text-rose-300 border-rose-500/35'}`}>
                {serverRunning ? 'ACTIVO (0.0.0.0:8080)' : 'DETENIDO'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Nodo local listo para recibir telemetría y cachear peticiones offline.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setServerRunning(!serverRunning);
            triggerFeedback(serverRunning ? 'Servidor Edge detenido.' : 'Servidor Edge iniciado correctamente.');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            serverRunning ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
          }`}
        >
          {serverRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{serverRunning ? 'Detener Servidor' : 'Iniciar Servidor Edge'}</span>
        </button>
      </div>

      {/* Resource Allocation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* RAM */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Asignación RAM</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{ramAllocated} MB</span>
            <span className="text-xs text-emerald-400">/ 2048 MB</span>
          </div>
          <input 
            type="range" 
            min="128" 
            max="1536" 
            step="128"
            value={ramAllocated}
            onChange={e => setRamAllocated(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Memoria RAM dedicada al motor de caché y brokers locales.</span>
        </div>

        {/* ROM / Storage */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Almacenamiento ROM</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{storageCache} GB</span>
            <span className="text-xs text-cyan-400">SQLite / NVMe</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(storageCache / 16) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 block">Espacio reservado para persistencia histórica de sensores.</span>
        </div>

        {/* Connected Clients */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Nodos Conectados</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{activeClients} Nodos</span>
            <span className="text-xs text-emerald-400">Mesh Activa</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Dispositivos IoT enrutados a través de este servidor local.</span>
        </div>

        {/* Security / Encryption */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Seguridad Edge</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-white block">AES-256 Firewall</span>
          <span className="text-[10px] text-emerald-400 font-semibold block">● Inspección de paquetes activa</span>
        </div>

      </div>

      {/* Server Console Logs */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Consola de Procesamiento Local (Edge Server Logs)</span>
        </h3>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 h-48 overflow-y-auto">
          <div className="text-emerald-400">[EDGE-SERVER] Inicializando motor de base de datos local SQLite en ROM...</div>
          <div className="text-slate-400">[HTTP] Servidor escuchando en http://0.0.0.0:8080 (Puerto seguro HTTPS habilitado).</div>
          <div className="text-cyan-300">[MQTT-BROKER] Broker interno iniciado en puerto 1883 para nodos ESP32 y sensores locales.</div>
          <div className="text-slate-400">[SYNC] Sincronización de búfer completada con éxito. Memoria RAM asignada: {ramAllocated}MB.</div>
          <div className="text-emerald-400">[READY] El dispositivo antiguo opera exitosamente como servidor de borde autónomo.</div>
        </div>
      </div>

    </div>
  );
};
