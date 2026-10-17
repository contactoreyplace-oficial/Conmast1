import React from 'react';
import { LayoutDashboard, Usb, Sliders, Brain, BellRing, ShieldCheck, Server, Share2, Smartphone, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Monitoreo en Vivo', icon: LayoutDashboard, desc: 'Dashboards y telemetría en tiempo real' },
    { id: 'quantum-frequency', label: 'Señal Cuántica & D2D Total', icon: Zap, desc: 'Quantum-FHSS y todos los medios D2D' },
    { id: 'connection', label: 'Conexión & Onboarding', icon: Usb, desc: 'USB/OTG, Wi-Fi, QR y BLE' },
    { id: 'remote', label: 'Control Remoto y Vista', icon: Sliders, desc: 'Actuadores, relés y cámara remota' },
    { id: 'edge-server', label: 'Servidor Edge (Dispositivo Viejo)', icon: Server, desc: 'RAM, ROM, caché y servidor local' },
    { id: 'd2d-hub', label: 'Conexión D2D, Módem & Repetidor', icon: Share2, desc: 'Control total y transferencia D2D' },
    { id: 'analytics', label: 'Análisis IA & Histórico', icon: Brain, desc: 'Diagnóstico neuronal y exportación' },
    { id: 'notifications', label: 'Notificaciones Push', icon: BellRing, desc: 'Reglas de alerta y canales' },
    { id: 'security', label: 'Seguridad & RBAC', icon: ShieldCheck, desc: 'Cifrado, permisos y auditoría' },
    { id: 'android-apk', label: 'Android APK & Permisos', icon: Smartphone, desc: 'AndroidManifest.xml y release APK' },
  ];

  return (
    <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 hidden md:block">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Módulos del Sistema
        </span>
      </div>

      <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-2 md:p-3 space-x-1 md:space-x-0 md:space-y-1.5 scrollbar-none">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-200 border border-cyan-500/40 shadow-lg shadow-cyan-950/50 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-300'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-semibold block leading-tight text-white">{item.label}</span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Connection Protocol Summary Card */}
      <div className="mt-auto p-4 hidden md:block m-3 bg-slate-950/70 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Protocolos Activos</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
          <div className="bg-slate-900 py-1.5 px-1 rounded border border-slate-800">
            <span className="block font-bold text-cyan-300">USB/OTG</span>
            <span className="text-slate-400">1 Puerto</span>
          </div>
          <div className="bg-slate-900 py-1.5 px-1 rounded border border-slate-800">
            <span className="block font-bold text-emerald-300">Wi-Fi</span>
            <span className="text-slate-400">MQTT</span>
          </div>
          <div className="bg-slate-900 py-1.5 px-1 rounded border border-slate-800">
            <span className="block font-bold text-purple-300">QR/BLE</span>
            <span className="text-slate-400">Seguro</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
