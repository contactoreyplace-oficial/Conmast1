import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Sliders, Video, Power, SlidersHorizontal, Palette, Flame, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const RemoteControlView: React.FC = () => {
  const { devices, activeDeviceId, updateDeviceControl } = useIoT();

  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];
  const [successMsg, setSuccessMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(true);

  const handleToggleRelay = (relayKey: 'relay1' | 'relay2') => {
    const newVal = !activeDevice.controls[relayKey];
    updateDeviceControl(activeDevice.id, { [relayKey]: newVal });
    triggerFeedback(`Relay ${relayKey === 'relay1' ? '1' : '2'} ${newVal ? 'Activado' : 'Desactivado'}`);
  };

  const handleMotorChange = (val: number) => {
    updateDeviceControl(activeDevice.id, { motorSpeed: val });
  };

  const handleColorChange = (color: string) => {
    updateDeviceControl(activeDevice.id, { rgbColor: color });
  };

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
            <Sliders className="w-6 h-6 text-cyan-400" />
            <span>Control Remoto y Vista de Dispositivo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestione actuadores en tiempo real, velocidad de motores, iluminación RGB, relés de potencia y flujo de cámara remota para <span className="text-cyan-300 font-semibold">{activeDevice.name}</span>.
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
        
        {/* Left: Actuator & Relay Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Relays Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Power className="w-4 h-4 text-emerald-400" />
              <span>Relés de Potencia y Válvulas</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-white block">Relé Principal (#1)</span>
                  <span className="text-[10px] text-slate-400">Alimentación Actuadores AC</span>
                </div>
                <button
                  onClick={() => handleToggleRelay('relay1')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    activeDevice.controls.relay1 ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeDevice.controls.relay1 ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-white block">Relé Auxiliar (#2)</span>
                  <span className="text-[10px] text-slate-400">Sistema de Ventilación / Bomba</span>
                </div>
                <button
                  onClick={() => handleToggleRelay('relay2')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    activeDevice.controls.relay2 ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeDevice.controls.relay2 ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Motor PWM Speed Slider */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Control PWM Motor / Bomba</span>
              </h3>
              <span className="font-mono text-cyan-300 font-bold text-xs">{activeDevice.controls.motorSpeed}%</span>
            </div>

            <input 
              type="range" 
              min="0" 
              max="100" 
              value={activeDevice.controls.motorSpeed}
              onChange={e => handleMotorChange(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Apagado)</span>
              <span>50% (Medio)</span>
              <span>100% (Máximo)</span>
            </div>
          </div>

          {/* RGB LED Indicator Color Picker */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Indicador LED RGB de Estado</span>
            </h3>

            <div className="flex items-center space-x-3">
              {['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-9 h-9 rounded-xl border-2 transition-all ${
                    activeDevice.controls.rgbColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex-1 text-right font-mono text-xs text-slate-400">
                {activeDevice.controls.rgbColor}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Remote Video Stream & Emergency Cutoff */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Vista Remota & Cámara de Monitoreo</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                    cameraActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cameraActive ? '● Stream en Vivo' : 'Pausado'}
                </button>
              </div>
            </div>

            {/* Video Feed Simulator */}
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden h-72 flex items-center justify-center">
              {cameraActive ? (
                <div className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80")' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CAM-01 • 1080p @ 30fps</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
                    <div>
                      <span className="font-bold text-cyan-300 block">{activeDevice.name}</span>
                      <span className="text-[10px] text-slate-400">{activeDevice.location}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">FPS: 30.0 • Bitrate: 2.4 Mbps</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs">
                  Cámara remota pausada. Haga clic en Stream en Vivo para reanudar.
                </div>
              )}
            </div>
          </div>

          {/* Emergency Kill Switch */}
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Paro de Emergencia (Kill Switch)</h4>
                <p className="text-xs text-slate-400">Detiene instantáneamente todos los motores y abre los relés de seguridad del equipo.</p>
              </div>
            </div>

            <button
              onClick={() => {
                updateDeviceControl(activeDevice.id, { relay1: false, relay2: false, motorSpeed: 0 });
                triggerFeedback('¡PARO DE EMERGENCIA EJECUTADO! Equipo seguro.');
              }}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-rose-600/30 transition-all uppercase tracking-wider whitespace-nowrap"
            >
              Ejecutar Paro de Emergencia
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
