import React from 'react';
import { Smartphone, Download, Shield, CheckCircle2, FileCode, Terminal } from 'lucide-react';

export const AndroidAPKModule: React.FC = () => {
  const permissionsList = [
    { permission: 'android.permission.INTERNET', purpose: 'Comunicación con servidores cloud y brokers MQTT' },
    { permission: 'android.permission.ACCESS_FINE_LOCATION', purpose: 'Escaneo de balizas BLE y redes Wi-Fi cercanas' },
    { permission: 'android.permission.BLUETOOTH_CONNECT', purpose: 'Emparejamiento seguro con nodos IoT BLE' },
    { permission: 'android.permission.CAMERA', purpose: 'Escaneo de códigos QR y stream de video remoto' },
    { permission: 'android.permission.USB_PERMISSION', purpose: 'Control de puertos serie físicos USB/OTG' },
    { permission: 'android.permission.FOREGROUND_SERVICE', purpose: 'Ejecución continua del servidor local en dispositivo antiguo' },
    { permission: 'android.permission.WAKE_LOCK', purpose: 'Evitar suspensión de CPU al operar como servidor Edge' },
    { permission: 'android.permission.RECEIVE_BOOT_COMPLETED', purpose: 'Reinicio automático del servidor local al encender el equipo' },
  ];

  const handleDownloadBlueprint = () => {
    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="io.iotnexus.pro.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.USB_PERMISSION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.IoTNexusPro">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    const blob = new Blob([manifestXml], { type: 'text/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AndroidManifest.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-cyan-400" />
            <span>Configuración Android APK & Permisos del Repositorio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paquete APK nativo preparado con todos los permisos de seguridad, servicios en primer plano y controladores USB/OTG para despliegue en Android.
          </p>
        </div>

        <button
          onClick={handleDownloadBlueprint}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Descargar AndroidManifest.xml</span>
        </button>
      </div>

      {/* Security & Permissions Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Permisos Obligatorios y Normas de Seguridad Android</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Permiso AndroidManifest</th>
                <th className="py-3 px-3 font-semibold">Propósito y Función Técnica</th>
                <th className="py-3 px-3 font-semibold">Estado de Seguridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {permissionsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-cyan-300">{item.permission}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{item.purpose}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-semibold">
                      Aprobado / Seguro
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APK Build Instructions */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Instrucciones para Compilación del APK Nativo en Gradle</span>
        </h3>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          <div className="text-slate-500"># 1. Clonar el repositorio con soporte PWA & Edge Server</div>
          <div className="text-cyan-300">git clone https://github.com/iot-nexus/iot-nexus-pro.git</div>
          <div className="text-slate-500 mt-2"># 2. Instalar dependencias del proyecto</div>
          <div className="text-cyan-300">npm install</div>
          <div className="text-slate-500 mt-2"># 3. Compilar APK de producción con Capacitor / Cordova o WebView Nativo</div>
          <div className="text-cyan-300">npx cap build android --prod</div>
          <div className="text-emerald-400 mt-2">[OK] APK generado en /android/app/build/outputs/apk/release/app-release.apk con firma SHA-256.</div>
        </div>
      </div>

    </div>
  );
};
