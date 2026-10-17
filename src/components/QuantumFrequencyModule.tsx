import React, { useState, useEffect } from 'react';
import { useIoT } from '../context/IoTContext';
import { Radio, Zap, ShieldCheck, Activity, Cpu, Wifi, Usb, Waves, CheckCircle2, RefreshCw, Lock } from 'lucide-react';
import { ConnectionType } from '../types';

export const QuantumFrequencyModule: React.FC = () => {
  const { devices, activeDeviceId } = useIoT();
  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];

  const [fhssActive, setFhssActive] = useState(true);
  const [hoppingSpeed, setHoppingSpeed] = useState(1024); // hops/sec
  const [carrierFrequency, setCarrierFrequency] = useState(2450.5); // MHz
  const [noiseLevel, setNoiseLevel] = useState(0.02); // %
  const [successMsg, setSuccessMsg] = useState('');

  // Simulated spectrum analyzer wave points
  const [spectrumData, setSpectrumData] = useState<number[]>(Array.from({ length: 32 }, () => Math.floor(Math.random() * 20) + 10));

  useEffect(() => {
    if (!fhssActive) return;
    const interval = setInterval(() => {
      setCarrierFrequency(Number((2400 + Math.random() * 150).toFixed(2)));
      setSpectrumData(Array.from({ length: 32 }, (_, i) => {
        // peak at center
        const distance = Math.abs(i - 16);
        const base = Math.max(5, 80 - distance * 4);
        return Math.floor(base + (Math.random() - 0.5) * 8);
      }));
    }, 500);
    return () => clearInterval(interval);
  }, [fhssActive]);

  const allMediums: { type: ConnectionType; name: string; desc: string; freq: string; range: string; icon: any }[] = [
    { type: 'quantum_fhss', name: 'Señal Frecuencial Única (Quantum-FHSS)', desc: 'Saltos de frecuencia de alta velocidad (1,024 hops/s) con cero interferencia y blindaje cuántico.', freq: '2.4GHz - 5.8GHz Dinámico', range: 'Ilimitado (Mesh)', icon: Zap },
    { type: 'wifidirect', name: 'Wi-Fi Direct (P2P)', desc: 'Conexión directa entre dispositivos sin pasar por router de acceso (hasta 250 Mbps).', freq: '2.4GHz / 5GHz', range: '200 metros', icon: Wifi },
    { type: 'ble', name: 'Bluetooth Classic & BLE 5.3', desc: 'Bajo consumo energético con perfiles de audio y serial optimizados.', freq: '2.402 - 2.480 GHz', range: '100 metros', icon: Radio },
    { type: 'usb', name: 'USB / OTG Serial (CDC/UART)', desc: 'Conexión física por cable con handshake de alta velocidad y alimentación simultánea.', freq: 'Buss Serial Físico', range: 'Cable Directo', icon: Usb },
    { type: 'nfc', name: 'NFC / RFID Proximity Tap', desc: 'Emparejamiento instantáneo por inducción magnética de corto alcance.', freq: '13.56 MHz', range: '10 centímetros', icon: Activity },
    { type: 'ultrasonic', name: 'Ondas Acústicas Ultrasónicas', desc: 'Transmisión de datos mediante portadoras de audio de alta frecuencia (18kHz - 22kHz).', freq: '18kHz - 22kHz', range: '15 metros (Acústico)', icon: Waves },
    { type: 'lora', name: 'LoRa Sub-GHz Radio', desc: 'Radiofrecuencia de largo alcance para telemetría industrial en entornos complejos.', freq: '868 MHz / 915 MHz', range: '15 Kilómetros', icon: Radio },
    { type: 'zigbee', name: 'Zigbee / Thread 802.15.4 Mesh', desc: 'Malla mallada mallada de ultra bajo consumo y alta resiliencia.', freq: '2.4 GHz ISM', range: '50 metros / Nodo', icon: Cpu },
    { type: 'infrared', name: 'Infrarrojo (IrDA / Óptico)', desc: 'Pulsos de luz modulada en línea de vista directa para comandos críticos.', freq: '850nm - 940nm', range: '10 metros', icon: ShieldCheck },
    { type: 'ethernet', name: 'Ethernet / LAN Gigabit Directo', desc: 'Puente físico por cable par trenzado Cat6 con aislamiento galvánico.', freq: 'Banda Base Cobre', range: '100 metros', icon: Cpu },
  ];

  const triggerFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span>Señal Frecuencial Única & Todos los Medios D2D</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tecnología cuántica de saltos de frecuencia (Quantum-FHSS) anti-interferencia y catálogo completo de conectividad Dispositivo a Dispositivo (D2D).
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
      </div>

      {/* Quantum-FHSS Master Controller Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/40 p-6 rounded-2xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500/20 text-cyan-400 p-3.5 rounded-2xl border border-cyan-500/40">
              <Radio className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Modulador Cuántico Anti-Interferencia (Quantum-FHSS)</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 font-semibold">
                  Cero Interferencia Garantizada
                </span>
              </div>
              <p className="text-xs text-slate-400">Canal exclusivo cifrado por fase de onda con cancelación adaptativa de ruido blanco.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setFhssActive(!fhssActive);
              triggerFeedback(fhssActive ? 'Modo Quantum-FHSS en pausa.' : '¡Señal Frecuencial Cuántica activada con éxito!');
            }}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center space-x-2 ${
              fhssActive 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{fhssActive ? 'Quantum-FHSS ACTIVO' : 'Activar Quantum-FHSS'}</span>
          </button>
        </div>

        {/* Oscilloscope / Spectrum Analyzer Simulator */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Analizador de Espectro Frecuencial en Vivo</span>
            <span className="text-cyan-400 font-bold">Portadora: {carrierFrequency} MHz | Saltos: {hoppingSpeed} hops/s</span>
          </div>

          {/* Simulated Wave Spectrum Bars */}
          <div className="h-36 flex items-end justify-between gap-1 bg-slate-950/80 p-2 rounded-xl border border-slate-900">
            {spectrumData.map((val, idx) => (
              <div 
                key={idx} 
                className="w-full bg-gradient-to-t from-cyan-600 to-emerald-400 rounded-t-sm transition-all duration-300"
                style={{ height: `${val}%`, opacity: fhssActive ? 0.9 : 0.3 }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2">
            <span>Tasa de Error de Paquetes (PER): 0.0000%</span>
            <span className="text-emerald-400 font-semibold">● Sincronización PLL Perfecta</span>
          </div>
        </div>
      </div>

      {/* Comprehensive D2D Connection Mediums Catalog */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Catálogo Integral de Medios de Conexión Dispositivo a Dispositivo (D2D)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Seleccione e integre cualquiera de los siguientes medios físicos e inalámbricos para enlazar <span className="text-cyan-300 font-semibold">{activeDevice.name}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {allMediums.map(m => {
            const Icon = m.icon;
            const isSelected = activeDevice.connectionType === m.type;
            return (
              <div 
                key={m.type}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-lg shadow-cyan-950 ring-1 ring-cyan-500/50' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-cyan-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 font-semibold">
                        Activo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-white mb-1">{m.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                </div>

                <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">{m.freq}</span>
                  <span className="text-cyan-400 font-semibold">{m.range}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
