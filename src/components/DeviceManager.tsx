import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Usb, Wifi, QrCode, Radio, Plus, CheckCircle, Terminal, RefreshCw, Smartphone, Shield, Key } from 'lucide-react';
import { ConnectionType } from '../types';

export const DeviceManager: React.FC = () => {
  const { addDevice, devices } = useIoT();

  const [activeTab, setActiveTab] = useState<'usb' | 'wifi' | 'qr' | 'ble'>('wifi');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('ESP32-S3 IoT Node');
  const [location, setLocation] = useState('Planta Baja - Sector C');
  
  // USB / OTG state
  const [baudRate, setBaudRate] = useState('115200');
  const [usbPort, setUsbPort] = useState('/dev/ttyUSB0');
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[INFO] Puerto USB/OTG inicializado a 115200 baudios.',
    '[OK] Handshake USB ACK recibido con éxito.',
    '[DATA] T:24.5C H:64% V:12.1V State:RUNNING'
  ]);
  const [commandInput, setCommandInput] = useState('');

  // Wi-Fi MQTT state
  const [ssid, setSsid] = useState('IoT_Nexus_Secure_5G');
  const [mqttBroker, setMqttBroker] = useState('mqtt.iotnexus.io:1883');

  // QR state
  const [qrCodeData, setQrCodeData] = useState('IOT-NEXUS-REG-TOKEN-998234-SECURE');

  const handleConnectDevice = (type: ConnectionType) => {
    if (!deviceName.trim()) {
      alert('Por favor ingrese un nombre para el dispositivo');
      return;
    }

    addDevice({
      name: deviceName,
      type: deviceType,
      location,
      connectionType: type,
      status: 'online',
      firmware: 'v2.5.0',
      ipAddress: type === 'wifi' ? '192.168.1.180' : undefined,
      usbPort: type === 'usb' || type === 'otg' ? usbPort : undefined,
      signalStrength: 95,
      secureToken: `sec_tok_${Math.random().toString(36).substring(2, 14)}`,
      controls: {
        relay1: false,
        relay2: false,
        motorSpeed: 50,
        rgbColor: '#06b6d4',
        targetTemp: 24,
      }
    });

    setSuccessMsg(`¡Dispositivo "${deviceName}" conectado y registrado exitosamente vía ${type.toUpperCase()}!`);
    setDeviceName('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSendSerialCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    setSerialLogs(prev => [`> ${commandInput}`, `[RESPONSE] ACK: Comando ejecutado correctamente en dispositivo USB/OTG.`, ...prev]);
    setCommandInput('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center space-x-3">
          <Usb className="w-6 h-6 text-cyan-400" />
          <span>Gestión de Conexión y Onboarding IoT</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Conecte sus dispositivos inteligentes mediante puertos USB/OTG físicos, redes Wi-Fi MQTT, códigos QR de aprovisionamiento instantáneo o Bluetooth LE.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center space-x-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Protocol Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('wifi')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            activeTab === 'wifi' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Wifi className={`w-5 h-5 ${activeTab === 'wifi' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Wi-Fi & MQTT</span>
            <span className="text-[10px] text-slate-400">Red Inalámbrica</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('usb')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            activeTab === 'usb' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Usb className={`w-5 h-5 ${activeTab === 'usb' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">USB / OTG Serial</span>
            <span className="text-[10px] text-slate-400">Cable Físico / UART</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            activeTab === 'qr' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <QrCode className={`w-5 h-5 ${activeTab === 'qr' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Código QR Onboarding</span>
            <span className="text-[10px] text-slate-400">Escaneo Rápido</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('ble')}
          className={`p-4 rounded-xl border text-left transition-all flex items-center space-x-3 ${
            activeTab === 'ble' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-950' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Radio className={`w-5 h-5 ${activeTab === 'ble' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <div>
            <span className="block font-bold text-xs">Bluetooth LE / Mesh</span>
            <span className="text-[10px] text-slate-400">Emparejamiento BLE</span>
          </div>
        </button>
      </div>

      {/* Tab Content: Wi-Fi MQTT */}
      {activeTab === 'wifi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Aprovisionamiento Wi-Fi / MQTT</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre del Dispositivo</label>
                <input 
                  type="text" 
                  value={deviceName} 
                  onChange={e => setDeviceName(e.target.value)}
                  placeholder="Ej: Sensor Invernadero #2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Tipo de Hardware</label>
                <select 
                  value={deviceType}
                  onChange={e => setDeviceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ESP32-S3 IoT Node">ESP32-S3 IoT Node</option>
                  <option value="Raspberry Pi 5 Gateway">Raspberry Pi 5 Gateway</option>
                  <option value="Arduino MKR WiFi 1010">Arduino MKR WiFi 1010</option>
                  <option value="Industrial PLC Modbus Gateway">Industrial PLC Modbus Gateway</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ubicación Física</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Red SSID Wi-Fi</label>
                <input 
                  type="text" 
                  value={ssid} 
                  onChange={e => setSsid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Broker MQTT (Host:Port)</label>
                <input 
                  type="text" 
                  value={mqttBroker} 
                  onChange={e => setMqttBroker(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => handleConnectDevice('wifi')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Vincular por Wi-Fi / MQTT</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Estado de la Red MQTT & Seguridad</h3>
              <p className="text-xs text-slate-400 mb-4">
                El broker MQTT mantiene canales cifrados TLS 1.3 con validación de certificados X.509 para cada nodo conectado.
              </p>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">Broker Principal (Cloud)</span>
                    <span className="text-slate-400">mqtts://broker.iotnexus.io:8883</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/35 font-semibold">
                    Conectado (TLS 1.3)
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">Subscripciones Activas</span>
                    <span className="text-slate-400">nexus/telemetry/# & nexus/alerts/#</span>
                  </div>
                  <span className="text-cyan-400 font-mono">QoS 1</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">Autenticación de Dispositivos</span>
                    <span className="text-slate-400">Tokens firmados con HMAC-SHA256</span>
                  </div>
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>Latencia promedio: 18ms</span>
              <span className="text-emerald-400">● Sincronizado</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: USB / OTG */}
      {activeTab === 'usb' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Usb className="w-4 h-4 text-cyan-400" />
              <span>Configuración Puerto USB / OTG</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre del Dispositivo Físico</label>
                <input 
                  type="text" 
                  value={deviceName} 
                  onChange={e => setDeviceName(e.target.value)}
                  placeholder="Ej: Inversor Solar USB"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Puerto Serie (USB / OTG)</label>
                <select 
                  value={usbPort}
                  onChange={e => setUsbPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="/dev/ttyUSB0">/dev/ttyUSB0 (OTG Android)</option>
                  <option value="/dev/ttyACM0">/dev/ttyACM0 (Arduino Native)</option>
                  <option value="COM3">COM3 (Windows Serial)</option>
                  <option value="COM5">COM5 (UART Bridge)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Baudios (Baud Rate)</label>
                <select 
                  value={baudRate}
                  onChange={e => setBaudRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="9600">9600 baud</option>
                  <option value="57600">57600 baud</option>
                  <option value="115200">115200 baud</option>
                  <option value="921600">921600 baud (High Speed)</option>
                </select>
              </div>

              <button
                onClick={() => handleConnectDevice('usb')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Conectar Puerto USB / OTG</span>
              </button>
            </div>
          </div>

          {/* Serial Terminal */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Consola Serial Interactiva ({usbPort})</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono">Connected @ {baudRate}</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-52 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5">
                {serialLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-cyan-300 font-semibold' : 'text-slate-300'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendSerialCommand} className="mt-4 flex space-x-2">
              <input 
                type="text" 
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                placeholder="Enviar comando AT o JSON (ej: AT+STATUS)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content: QR Onboarding */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>Aprovisionamiento por Código QR</span>
            </h3>
            <p className="text-xs text-slate-400">
              Escanee el código QR desde la aplicación móvil o genere un nuevo token para emparejar equipos IoT de forma segura y sin contraseñas manuales.
            </p>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                {/* Simulated QR Code Pattern */}
                <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400 font-mono text-xs text-center p-2 border-4 border-slate-900">
                  <div className="grid grid-cols-5 gap-1 w-full h-full bg-white p-1 rounded">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`rounded-xs ${i % 2 === 0 || i % 5 === 0 ? 'bg-slate-950' : 'bg-cyan-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                {qrCodeData}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Vincular Nuevo Nodo vía QR</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre del Dispositivo</label>
                <input 
                  type="text" 
                  value={deviceName} 
                  onChange={e => setDeviceName(e.target.value)}
                  placeholder="Ej: Medidor IoT Remoto #8"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Token QR de Activación</label>
                <input 
                  type="text" 
                  value={qrCodeData} 
                  onChange={e => setQrCodeData(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => handleConnectDevice('qr')}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Vincular Dispositivo por QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: BLE */}
      {activeTab === 'ble' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <span>Escáner Bluetooth LE & Redes Mesh Cercanas</span>
            </h3>
            <button 
              onClick={() => alert('Escaneando dispositivos BLE cercanos...')}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Buscar Nodos BLE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { name: 'Node_BLE_Sensor_A1', rssi: '-54 dBm', status: 'Disponible' },
              { name: 'Gateway_Mesh_Floor2', rssi: '-68 dBm', status: 'Emparejado' },
              { name: 'Smart_Valve_Controller', rssi: '-72 dBm', status: 'Disponible' },
            ].map((node, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-xs text-white block">{node.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Señal: {node.rssi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400">{node.status}</span>
                  <button 
                    onClick={() => {
                      setDeviceName(node.name);
                      handleConnectDevice('ble');
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] px-3 py-1 rounded-lg font-medium"
                  >
                    Vincular
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
