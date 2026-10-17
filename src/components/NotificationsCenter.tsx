import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { BellRing, Plus, Trash2, CheckCircle2, AlertTriangle, Shield, Bell } from 'lucide-react';

export const NotificationsCenter: React.FC = () => {
  const { devices, notificationRules, addNotificationRule, toggleNotificationRule, deleteNotificationRule, notifications, markNotificationAsRead } = useIoT();

  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id || '');
  const [metric, setMetric] = useState<'temperature' | 'voltage' | 'humidity' | 'pressure' | 'battery'>('temperature');
  const [condition, setCondition] = useState<'gt' | 'lt' | 'eq'>('gt');
  const [threshold, setThreshold] = useState<number>(30);
  const [channel, setChannel] = useState<'push' | 'webhook' | 'email' | 'all'>('push');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    addNotificationRule({
      deviceId: selectedDevice,
      metric,
      condition,
      threshold: Number(threshold),
      enabled: true,
      channel,
    });
    setSuccessMsg('¡Regla de notificación push creada exitosamente!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center space-x-3">
          <BellRing className="w-6 h-6 text-cyan-400" />
          <span>Centro de Notificaciones Push y Alertas Configurables</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure reglas automáticas para enviar notificaciones push a dispositivos móviles, webhooks o correos electrónicos cuando los sensores superen los umbrales críticos.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Create Rule Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Nueva Regla de Alerta Push</span>
          </h3>

          <form onSubmit={handleCreateRule} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Dispositivo Objetivo</label>
              <select
                value={selectedDevice}
                onChange={e => setSelectedDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Métrica a Monitorear</label>
              <select
                value={metric}
                onChange={e => setMetric(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 capitalize"
              >
                <option value="temperature">Temperatura (°C)</option>
                <option value="voltage">Voltaje (V)</option>
                <option value="humidity">Humedad (%)</option>
                <option value="pressure">Presión (hPa)</option>
                <option value="battery">Batería (%)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Condición</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="gt">Mayor que (&gt;)</option>
                  <option value="lt">Menor que (&lt;)</option>
                  <option value="eq">Igual a (=)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Umbral</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Canal de Notificación</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 uppercase"
              >
                <option value="push">Push Móvil / Web</option>
                <option value="webhook">Webhook HTTP API</option>
                <option value="email">Correo Electrónico</option>
                <option value="all">Todos los Canales</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar y Activar Regla</span>
            </button>
          </form>
        </div>

        {/* Right: Active Rules & History */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BellRing className="w-4 h-4 text-cyan-400" />
              <span>Reglas de Alerta Activas</span>
            </h3>

            <div className="space-y-3">
              {notificationRules.map(rule => {
                const dev = devices.find(d => d.id === rule.deviceId);
                return (
                  <div key={rule.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-cyan-300 block">{dev?.name || 'Dispositivo'}</span>
                      <p className="text-xs text-slate-300">
                        Si <span className="uppercase text-cyan-400 font-mono">{rule.metric}</span> {rule.condition === 'gt' ? '>' : rule.condition === 'lt' ? '<' : '='} <span className="font-bold text-white">{rule.threshold}</span>
                      </p>
                      <span className="text-[10px] text-slate-500 uppercase mt-0.5 block">Canal: {rule.channel}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleNotificationRule(rule.id)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                          rule.enabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {rule.enabled ? 'Activa' : 'Pausada'}
                      </button>
                      <button
                        onClick={() => deleteNotificationRule(rule.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Eliminar regla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
