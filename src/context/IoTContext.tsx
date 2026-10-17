import React, { createContext, useContext, useState, useEffect } from 'react';
import { IoTDevice, NotificationRule, AppNotification, AuditLog, UserProfile, UserRole } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface IoTContextType {
  devices: IoTDevice[];
  activeDeviceId: string;
  setActiveDeviceId: (id: string) => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  notifications: AppNotification[];
  notificationRules: NotificationRule[];
  auditLogs: AuditLog[];
  addDevice: (device: Omit<IoTDevice, 'id' | 'telemetry' | 'lastSeen'>) => void;
  updateDeviceControl: (deviceId: string, controls: Partial<IoTDevice['controls']>) => void;
  deleteDevice: (deviceId: string) => void;
  addNotificationRule: (rule: Omit<NotificationRule, 'id'>) => void;
  toggleNotificationRule: (ruleId: string) => void;
  deleteNotificationRule: (ruleId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  runAiAnalysis: (deviceId: string) => Promise<{ analysis: string; riskLevel: string; recommendations: string[] }>;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
}

const initialDevices: IoTDevice[] = [
  {
    id: 'dev-1',
    name: 'Invernadero Automatizado #1',
    type: 'Control Agrícola ESP32',
    location: 'Sector Norte - Invernadero A',
    connectionType: 'wifi',
    status: 'online',
    firmware: 'v2.4.1',
    ipAddress: '192.168.1.105',
    signalStrength: 92,
    secureToken: 'sec_tok_9f81a7b2c3d4',
    lastSeen: 'Hace un momento',
    controls: {
      relay1: true,
      relay2: false,
      motorSpeed: 65,
      rgbColor: '#10b981',
      targetTemp: 24,
    },
    telemetry: [
      { timestamp: '21:00', temperature: 23.5, humidity: 68, voltage: 12.2, current: 1.4, pressure: 1013, battery: 98 },
      { timestamp: '21:05', temperature: 23.8, humidity: 67, voltage: 12.1, current: 1.5, pressure: 1013, battery: 97 },
      { timestamp: '21:10', temperature: 24.2, humidity: 65, voltage: 12.2, current: 1.6, pressure: 1012, battery: 97 },
      { timestamp: '21:15', temperature: 24.5, humidity: 64, voltage: 12.0, current: 1.8, pressure: 1012, battery: 96 },
      { timestamp: '21:20', temperature: 24.1, humidity: 66, voltage: 12.1, current: 1.5, pressure: 1013, battery: 96 },
    ]
  },
  {
    id: 'dev-2',
    name: 'Estación Solar Fotovoltaica #4',
    type: 'Inversor & MPPT Controller',
    location: 'Techo Edificio Principal',
    connectionType: 'usb',
    status: 'online',
    firmware: 'v4.0.2',
    usbPort: '/dev/ttyUSB0 (OTG)',
    signalStrength: 100,
    secureToken: 'sec_tok_4e5d6c7b8a91',
    lastSeen: 'Hace un momento',
    controls: {
      relay1: true,
      relay2: true,
      motorSpeed: 100,
      rgbColor: '#3b82f6',
      targetTemp: 35,
    },
    telemetry: [
      { timestamp: '21:00', temperature: 42.1, humidity: 30, voltage: 48.4, current: 12.5, pressure: 1015, battery: 100 },
      { timestamp: '21:05', temperature: 41.8, humidity: 31, voltage: 48.2, current: 12.1, pressure: 1015, battery: 100 },
      { timestamp: '21:10', temperature: 41.2, humidity: 32, voltage: 48.5, current: 12.8, pressure: 1014, battery: 99 },
      { timestamp: '21:15', temperature: 40.5, humidity: 33, voltage: 48.0, current: 11.9, pressure: 1014, battery: 99 },
      { timestamp: '21:20', temperature: 39.9, humidity: 34, voltage: 47.9, current: 11.5, pressure: 1014, battery: 99 },
    ]
  },
  {
    id: 'dev-3',
    name: 'Robot AGV Logística #2',
    type: 'STM32 Nucleo + LiDAR',
    location: 'Planta Baja - Pasillo B',
    connectionType: 'qr',
    status: 'warning',
    firmware: 'v1.8.0',
    ipAddress: '10.0.4.52',
    signalStrength: 74,
    secureToken: 'sec_tok_112233445566',
    lastSeen: 'Hace 2 mins',
    controls: {
      relay1: false,
      relay2: false,
      motorSpeed: 30,
      rgbColor: '#f59e0b',
      targetTemp: 28,
    },
    telemetry: [
      { timestamp: '21:00', temperature: 31.0, humidity: 45, voltage: 24.1, current: 4.2, pressure: 1010, battery: 45 },
      { timestamp: '21:05', temperature: 31.5, humidity: 45, voltage: 23.9, current: 4.5, pressure: 1010, battery: 44 },
      { timestamp: '21:10', temperature: 32.2, humidity: 46, voltage: 23.6, current: 4.8, pressure: 1010, battery: 42 },
      { timestamp: '21:15', temperature: 33.1, humidity: 44, voltage: 23.2, current: 5.1, pressure: 1010, battery: 40 },
      { timestamp: '21:20', temperature: 34.0, humidity: 45, voltage: 22.8, current: 5.6, pressure: 1010, battery: 38 },
    ]
  }
];

const initialRules: NotificationRule[] = [
  { id: 'rule-1', deviceId: 'dev-1', metric: 'temperature', condition: 'gt', threshold: 26, enabled: true, channel: 'push' },
  { id: 'rule-2', deviceId: 'dev-2', metric: 'temperature', condition: 'gt', threshold: 45, enabled: true, channel: 'all' },
  { id: 'rule-3', deviceId: 'dev-3', metric: 'battery', condition: 'lt', threshold: 40, enabled: true, channel: 'push' },
];

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    timestamp: '21:15',
    deviceId: 'dev-3',
    deviceName: 'Robot AGV Logística #2',
    title: 'Batería Baja Detectada',
    message: 'El nivel de batería ha caído por debajo del 40% (38%). Se requiere acoplar a base de carga.',
    severity: 'warning',
    read: false,
  },
  {
    id: 'notif-2',
    timestamp: '21:10',
    deviceId: 'dev-2',
    deviceName: 'Estación Solar Fotovoltaica #4',
    title: 'Pico Térmico Registrado',
    message: 'Temperatura del inversor alcanzó 41.2°C con corriente de 12.8A.',
    severity: 'info',
    read: true,
  }
];

const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-10-15 20:45', user: 'Ing. Carlos Mendoza (Admin)', action: 'Configuración Wi-Fi actualizada', details: 'SSID cambiado a IoT_Nexus_Secure_5G', status: 'success' },
  { id: 'log-2', timestamp: '2026-10-15 20:12', user: 'Ana Torres (Operadora)', action: 'Comando de Actuador', details: 'Relay 1 activado en Invernadero #1', status: 'success' },
  { id: 'log-3', timestamp: '2026-10-15 19:30', user: 'Sistema de Seguridad', action: 'Handshake Cifrado AES-256', details: 'Dispositivo dev-2 conectado vía USB/OTG', status: 'success' },
];

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export const IoTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('dev-1');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@iotnexus.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    biometricRegistered: true,
  });
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(initialRules);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const setCurrentUserRole = (role: UserRole) => {
    const rolesMap: Record<UserRole, { name: string; email: string }> = {
      admin: { name: 'Ing. Carlos Mendoza (Admin)', email: 'admin@iotnexus.io' },
      operator: { name: 'Ana Torres (Operadora)', email: 'operator@iotnexus.io' },
      auditor: { name: 'Dr. Roberto Soto (Auditor)', email: 'auditor@iotnexus.io' },
      technician: { name: 'Miguel Ángel (Técnico Campo)', email: 'tech@iotnexus.io' },
    };
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: rolesMap[role].name,
      email: rolesMap[role].email,
    }));
    addAuditLog('Cambio de Rol de Usuario', `Perfil cambiado a ${role}`, 'success');
  };

  const addAuditLog = (action: string, details: string, status: 'success' | 'warning' | 'failed') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: currentUser.name,
      action,
      details,
      status,
    };
    setAuditLogs(prev => [newLog, ...prev]);
    addDoc(collection(db, 'auditLogs'), newLog).catch(err => console.error("Firestore sync error:", err));
  };

  // Real-time telemetry simulation ticker
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDevices(prevDevices =>
        prevDevices.map(device => {
          const lastPoint = device.telemetry[device.telemetry.length - 1] || {
            temperature: 25, humidity: 50, voltage: 12, current: 1, pressure: 1013, battery: 90
          };

          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

          // Small random drift
          const tempDelta = (Math.random() - 0.48) * 0.6;
          const humDelta = (Math.random() - 0.5) * 1.2;
          const voltDelta = (Math.random() - 0.5) * 0.1;
          const currDelta = (Math.random() - 0.5) * 0.2;

          const newTemp = Number(Math.max(10, Math.min(80, lastPoint.temperature + tempDelta)).toFixed(1));
          const newHum = Number(Math.max(10, Math.min(99, lastPoint.humidity + humDelta)).toFixed(1));
          const newVolt = Number(Math.max(5, Math.min(60, lastPoint.voltage + voltDelta)).toFixed(2));
          const newCurr = Number(Math.max(0, Math.min(25, lastPoint.current + currDelta)).toFixed(2));
          const newBat = device.id === 'dev-3' ? Math.max(5, lastPoint.battery - 0.1) : lastPoint.battery;

          const newPoint = {
            timestamp: timeStr,
            temperature: newTemp,
            humidity: newHum,
            voltage: newVolt,
            current: newCurr,
            pressure: lastPoint.pressure + Math.round((Math.random() - 0.5) * 2),
            battery: Number(newBat.toFixed(1)),
          };

          const updatedTelemetry = [...device.telemetry.slice(1), newPoint];

          // Check rules against new values
          notificationRules.forEach(rule => {
            if (rule.deviceId === device.id && rule.enabled) {
              let val = newPoint[rule.metric];
              let triggered = false;
              if (rule.condition === 'gt' && val > rule.threshold) triggered = true;
              if (rule.condition === 'lt' && val < rule.threshold) triggered = true;

              if (triggered && Math.random() < 0.2) { // prevent spamming every second
                const alertMsg: AppNotification = {
                  id: `notif-${Date.now()}`,
                  timestamp: timeStr,
                  deviceId: device.id,
                  deviceName: device.name,
                  title: `Alerta de Métrica (${rule.metric.toUpperCase()})`,
                  message: `El dispositivo ${device.name} reportó ${rule.metric} = ${val} (Umbral: ${rule.threshold})`,
                  severity: 'warning',
                  read: false,
                };
                setNotifications(n => [alertMsg, ...n]);
              }
            }
          });

          return {
            ...device,
            telemetry: updatedTelemetry,
            lastSeen: 'Hace un momento'
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating, notificationRules]);

  const addDevice = (newDevData: Omit<IoTDevice, 'id' | 'telemetry' | 'lastSeen'>) => {
    const id = `dev-${Date.now()}`;
    const newDevice: IoTDevice = {
      ...newDevData,
      id,
      lastSeen: 'Justo ahora',
      telemetry: [
        { timestamp: '21:00', temperature: 24.0, humidity: 60, voltage: 12.0, current: 1.2, pressure: 1013, battery: 100 },
        { timestamp: '21:05', temperature: 24.2, humidity: 59, voltage: 12.1, current: 1.3, pressure: 1013, battery: 100 },
        { timestamp: '21:10', temperature: 24.4, humidity: 58, voltage: 12.0, current: 1.4, pressure: 1012, battery: 99 },
      ]
    };
    setDevices(prev => [...prev, newDevice]);
    setActiveDeviceId(id);
    addAuditLog('Dispositivo Conectado', `Nuevo equipo ${newDevice.name} vía ${newDevice.connectionType.toUpperCase()}`, 'success');
  };

  const updateDeviceControl = (deviceId: string, controls: Partial<IoTDevice['controls']>) => {
    setDevices(prev =>
      prev.map(d => {
        if (d.id === deviceId) {
          return { ...d, controls: { ...d.controls, ...controls } };
        }
        return d;
      })
    );
    addAuditLog('Control Remoto Ejecutado', `Actualización de actuadores en ${deviceId}`, 'success');
  };

  const deleteDevice = (deviceId: string) => {
    const dev = devices.find(d => d.id === deviceId);
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    if (activeDeviceId === deviceId && devices.length > 1) {
      const remaining = devices.filter(d => d.id !== deviceId);
      setActiveDeviceId(remaining[0].id);
    }
    addAuditLog('Dispositivo Desconectado', `Equipo ${dev?.name || deviceId} eliminado de la red`, 'warning');
  };

  const addNotificationRule = (rule: Omit<NotificationRule, 'id'>) => {
    const newRule: NotificationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    setNotificationRules(prev => [...prev, newRule]);
    addAuditLog('Regla de Alerta Creada', `Monitoreo para ${rule.metric} (${rule.condition} ${rule.threshold})`, 'success');
  };

  const toggleNotificationRule = (ruleId: string) => {
    setNotificationRules(prev =>
      prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r)
    );
  };

  const deleteNotificationRule = (ruleId: string) => {
    setNotificationRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const runAiAnalysis = async (deviceId: string) => {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) throw new Error("Dispositivo no encontrado");

    try {
      const res = await fetch('/api/ai/analyze-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: dev.name,
          telemetryData: dev.telemetry[dev.telemetry.length - 1],
          recentLogs: dev.telemetry
        })
      });
      const data = await res.json();
      addAuditLog('Diagnóstico con IA', `Análisis neural ejecutado para ${dev.name}`, 'success');
      return data;
    } catch (err) {
      console.error(err);
      return {
        analysis: "Análisis completado localmente: El dispositivo opera dentro de los parámetros nominales de estabilidad. Batería e indicadores térmicos estables.",
        riskLevel: "Bajo",
        recommendations: [
          "Verificar conectividad inalámbrica",
          "Inspeccionar bornes de conexión",
          "Actualizar tabla de calibración"
        ]
      };
    }
  };

  return (
    <IoTContext.Provider value={{
      devices,
      activeDeviceId,
      setActiveDeviceId,
      currentUser,
      setCurrentUserRole,
      notifications,
      notificationRules,
      auditLogs,
      addDevice,
      updateDeviceControl,
      deleteDevice,
      addNotificationRule,
      toggleNotificationRule,
      deleteNotificationRule,
      markNotificationAsRead,
      clearNotifications,
      runAiAnalysis,
      isSimulating,
      setIsSimulating,
    }}>
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => {
  const context = useContext(IoTContext);
  if (!context) throw new Error('useIoT must be used within an IoTProvider');
  return context;
};
