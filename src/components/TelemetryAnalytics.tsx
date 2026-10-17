import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Brain, Download, FileSpreadsheet, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, BarChart3, Database } from 'lucide-react';

export const TelemetryAnalytics: React.FC = () => {
  const { devices, activeDeviceId, runAiAnalysis } = useIoT();

  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<{ analysis: string; riskLevel: string; recommendations: string[] } | null>(null);

  const handleRunAi = async () => {
    setLoadingAi(true);
    try {
      const res = await runAiAnalysis(activeDevice.id);
      setAiResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Temperature(C)', 'Humidity(%)', 'Voltage(V)', 'Current(A)', 'Pressure(hPa)', 'Battery(%)'];
    const rows = activeDevice.telemetry.map(t => [
      t.timestamp,
      t.temperature,
      t.humidity,
      t.voltage,
      t.current,
      t.pressure,
      t.battery
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telemetria_${activeDevice.name.replace(/\s+/g, '_')}_${Date.now()}.csv`);
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
            <Brain className="w-6 h-6 text-cyan-400" />
            <span>Análisis Avanzado de Telemetría con IA (Gemini)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Diagnóstico inteligente de anomalías, mantenimiento predictivo y exportación de datos históricos para <span className="text-cyan-300 font-semibold">{activeDevice.name}</span>.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center space-x-2 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV Histórico</span>
        </button>
      </div>

      {/* AI Assistant Banner & Run Button */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500/20 text-cyan-400 p-3 rounded-2xl border border-cyan-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Asistente Neural de Diagnóstico IoT</h3>
              <p className="text-xs text-slate-400">Analiza los registros de sensores en tiempo real mediante Gemini 2.5 Flash para detectar riesgos y prevenir fallas.</p>
            </div>
          </div>

          <button
            onClick={handleRunAi}
            disabled={loadingAi}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loadingAi ? 'Analizando Telemetría...' : 'Ejecutar Diagnóstico con IA'}</span>
          </button>
        </div>

        {aiResult && (
          <div className="mt-4 bg-slate-950 p-5 rounded-xl border border-cyan-500/40 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Resultado del Análisis Neural</span>
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                aiResult.riskLevel === 'Crítico' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                aiResult.riskLevel === 'Alto' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                Nivel de Riesgo: {aiResult.riskLevel}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{aiResult.analysis}</p>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Recomendaciones de Mantenimiento Preventivo:</span>
              <ul className="space-y-1.5 text-xs text-cyan-200">
                {aiResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Historical Data Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Registros Históricos de Telemetría ({activeDevice.name})</span>
          </h3>
          <span className="text-xs text-slate-400">{activeDevice.telemetry.length} registros en búfer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Hora</th>
                <th className="py-3 px-3 font-semibold">Temperatura</th>
                <th className="py-3 px-3 font-semibold">Humedad</th>
                <th className="py-3 px-3 font-semibold">Voltaje</th>
                <th className="py-3 px-3 font-semibold">Corriente</th>
                <th className="py-3 px-3 font-semibold">Presión</th>
                <th className="py-3 px-3 font-semibold">Batería</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {activeDevice.telemetry.slice().reverse().map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-cyan-300">{t.timestamp}</td>
                  <td className="py-3 px-3">{t.temperature}°C</td>
                  <td className="py-3 px-3">{t.humidity}%</td>
                  <td className="py-3 px-3">{t.voltage}V</td>
                  <td className="py-3 px-3">{t.current}A</td>
                  <td className="py-3 px-3">{t.pressure}hPa</td>
                  <td className="py-3 px-3 text-emerald-400">{t.battery}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
