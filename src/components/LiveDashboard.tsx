import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Thermometer, Droplets, Zap, Activity, Battery, Wifi, Usb, QrCode, Cpu, ArrowUpRight, ShieldCheck, Play, Pause, Radio } from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  const { devices, activeDeviceId, setActiveDeviceId } = useIoT();
  const [metricTab, setMetricTab] = useState<'temperature' | 'voltage' | 'current' | 'humidity'>('temperature');

  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];
  const latestTelemetry = activeDevice.telemetry[activeDevice.telemetry.length - 1] || {
    temperature: 0, humidity: 0, voltage: 0, current: 0, pressure: 0, battery: 100
  };

  const connectionIcon = {
    wifi: <Wifi className="w-4 h-4 text-emerald-400" />,
    usb: <Usb className="w-4 h-4 text-cyan-400" />,
    otg: <Usb className="w-4 h-4 text-cyan-400" />,
    qr: <QrCode className="w-4 h-4 text-purple-400" />,
    ble: <Activity className="w-4 h-4 text-blue-400" />,
    wifidirect: <Wifi className="w-4 h-4 text-teal-400" />,
    nfc: <Activity className="w-4 h-4 text-indigo-400" />,
    ultrasonic: <Activity className="w-4 h-4 text-amber-400" />,
    lora: <Radio className="w-4 h-4 text-orange-400" />,
    zigbee: <Cpu className="w-4 h-4 text-pink-400" />,
    infrared: <ShieldCheck className="w-4 h-4 text-red-400" />,
    ethernet: <Cpu className="w-4 h-4 text-blue-300" />,
    quantum_fhss: <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />,
  }[activeDevice.connectionType] || <Wifi className="w-4 h-4 text-emerald-400" />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Device Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Red IoT Activa</span>
            <span>•</span>
            <span className="text-cyan-400 uppercase font-mono">{activeDevice.location}</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <span>{activeDevice.name}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center space-x-1 ${
              activeDevice.status === 'online' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
              activeDevice.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                activeDevice.status === 'online' ? 'bg-emerald-400 animate-ping' :
                activeDevice.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="capitalize">{activeDevice.status}</span>
            </span>
          </h2>
        </div>

        {/* Device selector tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {devices.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDeviceId(d.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                d.id === activeDeviceId
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{d.name.split(' ')[0]} {d.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Temperature */}
        <div 
          onClick={() => setMetricTab('temperature')}
          className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
            metricTab === 'temperature' ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Temperatura</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{latestTelemetry.temperature}°C</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium">+0.2%</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Rango óptimo: 20° - 35°</span>
            <span className="text-cyan-400 font-medium">Ver gráfica</span>
          </div>
        </div>

        {/* Voltage */}
        <div 
          onClick={() => setMetricTab('voltage')}
          className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
            metricTab === 'voltage' ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Voltaje</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{latestTelemetry.voltage} V</span>
            <span className="text-xs text-slate-400 font-mono">Estable</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Corriente: {latestTelemetry.current} A</span>
            <span className="text-cyan-400 font-medium">Ver gráfica</span>
          </div>
        </div>

        {/* Humidity */}
        <div 
          onClick={() => setMetricTab('humidity')}
          className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
            metricTab === 'humidity' ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Humedad / Presión</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{latestTelemetry.humidity}%</span>
            <span className="text-xs text-cyan-400">{latestTelemetry.pressure} hPa</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Atmósfera normal</span>
            <span className="text-cyan-400 font-medium">Ver gráfica</span>
          </div>
        </div>

        {/* Battery */}
        <div 
          onClick={() => setMetricTab('current')}
          className={`bg-slate-900 border p-4 rounded-2xl cursor-pointer transition-all ${
            metricTab === 'current' ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Batería & Señal</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Battery className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{latestTelemetry.battery}%</span>
            <span className="text-xs text-emerald-400">{activeDevice.signalStrength}% RSSI</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Cifrado AES-256</span>
            <span className="text-cyan-400 font-medium">Seguro</span>
          </div>
        </div>

      </div>

      {/* Main Telemetry Chart Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>Telemetría en Tiempo Real ({metricTab.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Muestreo continuo optimizado por protocolo {activeDevice.connectionType.toUpperCase()}
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['temperature', 'voltage', 'current', 'humidity'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetricTab(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  metricTab === m 
                    ? 'bg-cyan-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'temperature' ? 'Temperatura' : m === 'voltage' ? 'Voltaje' : m === 'current' ? 'Corriente' : 'Humedad'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeDevice.telemetry}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" textAnchor="end" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Area 
                type="monotone" 
                dataKey={metricTab} 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorMetric)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device metadata footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Firmware:</span>
            <span className="font-mono text-slate-300">{activeDevice.firmware}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Token de Sesión:</span>
            <span className="font-mono text-cyan-300">{activeDevice.secureToken}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Protocolo:</span>
            <span className="uppercase font-semibold text-emerald-400 flex items-center space-x-1">
              {connectionIcon}
              <span>{activeDevice.connectionType}</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
