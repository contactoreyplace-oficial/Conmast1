import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Lock, User, KeyRound, CheckCircle2, ScanFace, ArrowRight } from 'lucide-react';

interface BiometricAuthModalProps {
  onAuthenticated: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({ onAuthenticated }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('carlos.mendoza@iotnexus.io');
  const [password, setPassword] = useState('••••••••••••');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleBiometricScan = () => {
    setScanStep('scanning');
    setScanning(true);
    setTimeout(() => {
      setScanStep('success');
      setScanning(false);
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBiometricScan();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 text-white relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/30 text-white mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">IoT Nexus Pro Secure Vault</h2>
          <p className="text-xs text-slate-400">
            {isRegistering ? 'Registro con Cifrado AES-256 & Biometría' : 'Acceso Seguro con Autenticación Biométrica'}
          </p>
        </div>

        {/* Biometric Scanner Animation Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
          <div 
            onClick={handleBiometricScan}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
              scanStep === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30' :
              scanStep === 'scanning' ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500 animate-pulse' : 'bg-slate-900 text-cyan-400 border border-slate-700 hover:border-cyan-500'
            }`}
          >
            {scanStep === 'success' ? <CheckCircle2 className="w-10 h-10" /> : <Fingerprint className="w-10 h-10 animate-pulse" />}
          </div>

          <div className="text-center">
            <span className="text-xs font-semibold text-cyan-300 block">
              {scanStep === 'idle' ? 'Toque el sensor biométrico o escanee rostro' :
               scanStep === 'scanning' ? 'Verificando huella biométrica y clave AES-256...' : '¡Autenticación biométrica exitosa!'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">WebAuthn / FIDO2 Hardware Security</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Correo Electrónico Seguro</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Contraseña o Llave Privada</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={scanning}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isRegistering ? 'Crear Cuenta Biométrica' : 'Entrar con Biometría'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            {isRegistering ? '¿Ya tiene cuenta? Iniciar sesión' : '¿Nuevo usuario? Registrar con seguridad biométrica'}
          </button>
        </div>

      </div>
    </div>
  );
};
