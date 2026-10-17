import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Cpu, Bell, Shield, Play, Pause, User, ChevronDown, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { UserRole } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications,
    isSimulating,
    setIsSimulating,
    devices,
    activeDeviceId,
    logout
  } = useIoT();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeDevice = devices.find(d => d.id === activeDeviceId);

  const roleNames: Record<UserRole, string> = {
    admin: 'Administrador (Total)',
    operator: 'Operador (Control)',
    auditor: 'Auditor (Lectura)',
    technician: 'Técnico de Campo (USB/OTG)'
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                IoT Nexus Pro
              </h1>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/35 font-medium">
                v2.5 PWA Edge
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Control Total D2D, Servidor Local Edge & Telemetría IoT
            </p>
          </div>
        </div>

        {/* Center: Active Device Quick Status */}
        {activeDevice && (
          <div className="hidden md:flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60">
            <span className={`w-2.5 h-2.5 rounded-full ${
              activeDevice.status === 'online' ? 'bg-emerald-400 animate-ping' :
              activeDevice.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            <div className="text-xs">
              <span className="text-slate-400 block">Dispositivo Activo:</span>
              <span className="font-semibold text-cyan-200">{activeDevice.name}</span>
            </div>
            <div className="border-l border-slate-700 pl-3 text-xs text-slate-300">
              <span className="text-slate-400 block">Conexión:</span>
              <span className="uppercase font-mono text-cyan-400 font-bold">{activeDevice.connectionType}</span>
            </div>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSimulating 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Pausar o reanudar telemetría en tiempo real"
          >
            {isSimulating ? <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimulating ? 'Telemetría en Vivo' : 'Pausado'}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Centro de Alertas Push"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-sm">Notificaciones Push & Alertas</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No hay notificaciones recientes.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-900/60 ${n.read ? 'opacity-60 bg-slate-950' : 'bg-slate-900/40 border-l-2 border-cyan-500'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-cyan-300">{n.deviceName}</span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="font-medium text-slate-200 mb-1">{n.title}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher (RBAC) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors text-xs"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-cyan-500" />
              <div className="text-left hidden lg:block">
                <span className="font-medium text-slate-200 block truncate max-w-[120px]">{currentUser.name}</span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs text-slate-400">Simulador de Permisos (RBAC)</p>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                </div>
                {(['admin', 'operator', 'auditor', 'technician'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === r ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{roleNames[r]}</span>
                    {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
                <div className="border-t border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                      window.location.reload();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-between"
                  >
                    <span>Cerrar Sesión (Firebase)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
