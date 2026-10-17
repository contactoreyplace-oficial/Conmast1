import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Workflow, Plus, Trash2, CheckCircle2, Zap, ArrowRight, Sliders, Bell } from 'lucide-react';
import { IFTTTRule } from '../types';

export const IFTTTAutomationModule: React.FC = () => {
  const { devices } = useIoT();

  const [rules, setRules] = useState<IFTTTRule[]>([
    {
      id: 'rule-1',
      name: 'Ventilación Automática por Calor',
      enabled: true,
      trigger: { deviceId: devices[0]?.id || 'dev-1', metric: 'temperature', condition: 'gt', threshold: 25 },
      action: { targetDeviceId: devices[0]?.id || 'dev-1', actionType: 'relay1_on' },
      lastTriggered: 'Hace 5 min'
    },
    {
      id: 'rule-2',
      name: 'Modo Ahorro por Batería Baja',
      enabled: true,
      trigger: { deviceId: devices[2]?.id || 'dev-3', metric: 'battery', condition: 'lt', threshold: 40 },
      action: { targetDeviceId: devices[2]?.id || 'dev-3', actionType: 'set_motor', value: 20 },
      lastTriggered: 'Hace 1 hora'
    }
  ]);

  const [ruleName, setRuleName] = useState('');
  const [triggerDevice, setTriggerDevice] = useState(devices[0]?.id || '');
  const [metric, setMetric] = useState<'temperature' | 'voltage' | 'humidity' | 'battery'>('temperature');
  const [condition, setCondition] = useState<'gt' | 'lt'>('gt');
  const [threshold, setThreshold] = useState<number>(26);
  const [actionDevice, setActionDevice] = useState(devices[0]?.id || '');
  const [actionType, setActionType] = useState<'relay1_on' | 'relay1_off' | 'relay2_on' | 'relay2_off' | 'set_motor' | 'send_push'>('relay1_on');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      alert('Por favor ingrese un nombre para la automatización');
      return;
    }

    const newRule: IFTTTRule = {
      id: `rule-${Date.now()}`,
      name: ruleName,
      enabled: true,
      trigger: { deviceId: triggerDevice, metric, condition, threshold: Number(threshold) },
      action: { targetDeviceId: actionDevice, actionType },
      lastTriggered: 'Nunca'
    };

    setRules(prev => [...prev, newRule]);
    setRuleName('');
    setSuccessMsg('¡Regla IFTTT creada y activada exitosamente!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <Workflow className="w-6 h-6 text-cyan-400" />
            <span>Automatización Inteligente (Si esto, entonces aquello - IFTTT)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cree reglas lógicas personalizadas para conectar dispositivos y automatizar acciones sin necesidad de programación.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Create IFTTT Rule Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Nueva Regla IFTTT</span>
          </h3>

          <form onSubmit={handleCreateRule} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nombre de la Automatización</label>
              <input 
                type="text" 
                value={ruleName}
                onChange={e => setRuleName(e.target.value)}
                placeholder="Ej: Activar Alarma por Batería Baja"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Trigger section */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">1. SI ESTO (Trigger)</span>
              
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Dispositivo Origen</label>
                <select 
                  value={triggerDevice}
                  onChange={e => setTriggerDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Métrica</label>
                  <select 
                    value={metric}
                    onChange={e => setMetric(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white capitalize"
                  >
                    <option value="temperature">Temp</option>
                    <option value="voltage">Volt</option>
                    <option value="humidity">Hum</option>
                    <option value="battery">Bat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Condición</label>
                  <select 
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white"
                  >
                    <option value="gt">Mayor (&gt;)</option>
                    <option value="lt">Menor (&lt;)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Umbral</label>
                  <input 
                    type="number"
                    value={threshold}
                    onChange={e => setThreshold(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Action section */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">2. ENTONCES AQUELLO (Action)</span>
              
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Dispositivo Destino</label>
                <select 
                  value={actionDevice}
                  onChange={e => setActionDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Acción a Ejecutar</label>
                <select 
                  value={actionType}
                  onChange={e => setActionType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="relay1_on">Encender Relé Principal (#1)</option>
                  <option value="relay1_off">Apagar Relé Principal (#1)</option>
                  <option value="relay2_on">Encender Relé Auxiliar (#2)</option>
                  <option value="relay2_off">Apagar Relé Auxiliar (#2)</option>
                  <option value="set_motor">Ajustar Motor PWM (50%)</option>
                  <option value="send_push">Enviar Notificación Push</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Regla IFTTT</span>
            </button>
          </form>
        </div>

        {/* Right: Active Rules List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>Automatizaciones Activas</span>
          </h3>

          <div className="space-y-3">
            {rules.map(rule => {
              const triggerDev = devices.find(d => d.id === rule.trigger.deviceId);
              const actionDev = devices.find(d => d.id === rule.action.targetDeviceId);
              return (
                <div key={rule.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{rule.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${rule.enabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {rule.enabled ? 'Activa' : 'Pausada'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                        SI <strong className="text-white">{triggerDev?.name}</strong> ({rule.trigger.metric} {rule.trigger.condition === 'gt' ? '>' : '<'} {rule.trigger.threshold})
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                      <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        ENTONCES <strong className="text-white">{actionDev?.name}</strong> ({rule.action.actionType})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 block">Último disparo: {rule.lastTriggered || 'Ninguno'}</span>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold border transition-colors ${
                        rule.enabled ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {rule.enabled ? 'Pausar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-xl bg-slate-800/60"
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
  );
};
