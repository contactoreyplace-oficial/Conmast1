import React from 'react';
import { useIoT } from '../context/IoTContext';
import { ShieldCheck, Shield, Key, Lock, UserCheck, History, CheckCircle2 } from 'lucide-react';

export const SecurityRBAC: React.FC = () => {
  const { auditLogs, currentUser, devices } = useIoT();

  const rolePermissions = [
    { role: 'Administrador (Admin)', access: 'Acceso Total', usbOtg: 'Sí', remoteControl: 'Sí', aiAnalysis: 'Sí', userMgmt: 'Sí' },
    { role: 'Operador (Operator)', access: 'Monitoreo y Control', usbOtg: 'No', remoteControl: 'Sí', aiAnalysis: 'Sí', userMgmt: 'No' },
    { role: 'Técnico de Campo (Technician)', access: 'Conexión USB/OTG', usbOtg: 'Sí', remoteControl: 'Sí', aiAnalysis: 'No', userMgmt: 'No' },
    { role: 'Auditor (Auditor)', access: 'Lectura y Auditoría', usbOtg: 'No', remoteControl: 'No', aiAnalysis: 'Sí', userMgmt: 'No' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <span>Seguridad Cifrada y Acceso Multiusuario (RBAC)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gestión de cifrado de extremo a extremo AES-256, tokens de sesión seguros y niveles de permisos granulares para la administración de equipos IoT.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cifrado de Enlace</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-white block">AES-256 / TLS 1.3</span>
          <p className="text-[11px] text-slate-400">Todos los paquetes MQTT, USB/OTG y REST están firmados y cifrados.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Usuario Actual</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-lg font-bold text-white truncate block">{currentUser.name}</span>
          <span className="text-xs text-cyan-400 uppercase font-mono block">Rol: {currentUser.role}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Dispositivos Protegidos</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-white block">{devices.length} Activos</span>
          <p className="text-[11px] text-slate-400">Tokens HMAC-SHA256 verificados en cada handshake.</p>
        </div>

      </div>

      {/* RBAC Matrix */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Matriz de Permisos Granulares por Rol</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Rol de Usuario</th>
                <th className="py-3 px-3 font-semibold">Nivel de Acceso</th>
                <th className="py-3 px-3 font-semibold">Conexión USB/OTG</th>
                <th className="py-3 px-3 font-semibold">Control Remoto</th>
                <th className="py-3 px-3 font-semibold">Diagnóstico IA</th>
                <th className="py-3 px-3 font-semibold">Gestión Usuarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rolePermissions.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{item.role}</td>
                  <td className="py-3 px-3 text-cyan-300">{item.access}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{item.usbOtg}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{item.remoteControl}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{item.aiAnalysis}</td>
                  <td className="py-3 px-3 font-semibold text-purple-400">{item.userMgmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span>Registro de Auditoría y Trazabilidad del Sistema</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Fecha y Hora</th>
                <th className="py-3 px-3 font-semibold">Usuario / Entidad</th>
                <th className="py-3 px-3 font-semibold">Acción</th>
                <th className="py-3 px-3 font-semibold">Detalles</th>
                <th className="py-3 px-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-3 text-cyan-300">{log.user}</td>
                  <td className="py-3 px-3 font-semibold text-white">{log.action}</td>
                  <td className="py-3 px-3 text-slate-400">{log.details}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-sans font-semibold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
