export type ConnectionType = 
  | 'usb' 
  | 'otg' 
  | 'wifi' 
  | 'qr' 
  | 'ble' 
  | 'wifidirect' 
  | 'nfc' 
  | 'ultrasonic' 
  | 'lora' 
  | 'zigbee' 
  | 'infrared' 
  | 'ethernet' 
  | 'quantum_fhss';

export type DeviceStatus = 'online' | 'warning' | 'offline' | 'calibrating';

export type UserRole = 'admin' | 'operator' | 'auditor' | 'technician';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface TelemetryPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  voltage: number;
  current: number;
  pressure: number;
  battery: number;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  connectionType: ConnectionType;
  status: DeviceStatus;
  firmware: string;
  ipAddress?: string;
  usbPort?: string;
  signalStrength: number; // dBm or %
  telemetry: TelemetryPoint[];
  controls: {
    relay1: boolean;
    relay2: boolean;
    motorSpeed: number; // 0 - 100%
    rgbColor: string;
    targetTemp: number;
  };
  secureToken: string;
  lastSeen: string;
}

export interface NotificationRule {
  id: string;
  deviceId: string;
  metric: 'temperature' | 'voltage' | 'humidity' | 'pressure' | 'battery';
  condition: 'gt' | 'lt' | 'eq';
  threshold: number;
  enabled: boolean;
  channel: 'push' | 'webhook' | 'email' | 'all';
}

export interface AppNotification {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'failed';
}
