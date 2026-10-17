/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { IoTProvider } from './context/IoTContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LiveDashboard } from './components/LiveDashboard';
import { QuantumFrequencyModule } from './components/QuantumFrequencyModule';
import { IFTTTAutomationModule } from './components/IFTTTAutomationModule';
import { DeviceManager } from './components/DeviceManager';
import { RemoteControlView } from './components/RemoteControlView';
import { EdgeServerModule } from './components/EdgeServerModule';
import { D2DHubModule } from './components/D2DHubModule';
import { TelemetryAnalytics } from './components/TelemetryAnalytics';
import { NotificationsCenter } from './components/NotificationsCenter';
import { SecurityRBAC } from './components/SecurityRBAC';
import { AndroidAPKModule } from './components/AndroidAPKModule';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {!isAuthenticated && (
        <BiometricAuthModal onAuthenticated={() => setIsAuthenticated(true)} />
      )}

      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-slate-950 relative pb-12">
          {activeTab === 'dashboard' && <LiveDashboard />}
          {activeTab === 'quantum-frequency' && <QuantumFrequencyModule />}
          {activeTab === 'ifttt-automation' && <IFTTTAutomationModule />}
          {activeTab === 'connection' && <DeviceManager />}
          {activeTab === 'remote' && <RemoteControlView />}
          {activeTab === 'edge-server' && <EdgeServerModule />}
          {activeTab === 'd2d-hub' && <D2DHubModule />}
          {activeTab === 'analytics' && <TelemetryAnalytics />}
          {activeTab === 'notifications' && <NotificationsCenter />}
          {activeTab === 'security' && <SecurityRBAC />}
          {activeTab === 'android-apk' && <AndroidAPKModule />}
        </main>
      </div>

      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <IoTProvider>
      <MainLayout />
    </IoTProvider>
  );
}
