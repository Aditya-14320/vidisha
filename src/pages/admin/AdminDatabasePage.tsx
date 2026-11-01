import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Trash2,
  Building2,
  Grid,
  Tag,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Save,
  Check,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { Business, Category, Offer, ListingApplication, PaymentRecord } from '../../types';

export const AdminDatabasePage: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState<'businesses' | 'categories' | 'offers' | 'applications' | 'payments' | 'all'>('businesses');
  const [jsonText, setJsonText] = useState('');
  const [stats, setStats] = useState({
    businesses: 0,
    categories: 0,
    offers: 0,
    applications: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const db = StorageService.exportFullDatabase();
      setStats({
        businesses: (db.businesses || []).length,
        categories: (db.categories || []).length,
        offers: (db.offers || []).length,
        applications: (db.applications || []).length,
        payments: (db.payments || []).length,
      });

      if (activeCollection === 'all') {
        setJsonText(JSON.stringify(db, null, 2));
      } else {
        setJsonText(JSON.stringify((db as any)[activeCollection] || [], null, 2));
      }
    } catch (err: any) {
      console.error('Failed to load database dump', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCollection]);

  const handleDownloadJSON = () => {
    try {
      const fullDb = StorageService.exportFullDatabase();
      const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vidishacity_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage({ text: 'Database exported and downloaded successfully.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: 'Failed to export database: ' + err.message, type: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = StorageService.importFullDatabase(parsed);
        if (res.success) {
          setMessage({ text: `Database restored successfully (${res.count} records processed).`, type: 'success' });
          loadData();
        } else {
          setMessage({ text: res.error || 'Failed to import database file.', type: 'error' });
        }
      } catch (err: any) {
        setMessage({ text: 'Invalid JSON file: ' + err.message, type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveJsonEditor = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const fullDb = StorageService.exportFullDatabase();

      if (activeCollection === 'all') {
        const res = StorageService.importFullDatabase(parsed);
        if (res.success) {
          setMessage({ text: 'Entire database updated and saved successfully!', type: 'success' });
        } else {
          setMessage({ text: res.error || 'Failed to save database.', type: 'error' });
        }
      } else {
        (fullDb as any)[activeCollection] = parsed;
        const res = StorageService.importFullDatabase(fullDb);
        if (res.success) {
          setMessage({ text: `Collection "${activeCollection}" updated with ${Array.isArray(parsed) ? parsed.length : 1} records!`, type: 'success' });
        } else {
          setMessage({ text: res.error || 'Failed to update collection.', type: 'error' });
        }
      }
      loadData();
    } catch (err: any) {
      setMessage({ text: 'Syntax Error in JSON: ' + err.message, type: 'error' });
    }
  };

  const handleResetToSeed = () => {
    if (!window.confirm('Load official Vidisha seed database? This will populate all verified categories, sample shops, and offers.')) return;
    StorageService.resetToFullSeedDatabase();
    setMessage({ text: 'Official Vidisha database loaded successfully!', type: 'success' });
    loadData();
  };

  const handleSyncToFirestore = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await StorageService.syncSeedToFirestore();
      if (res.success) {
        setMessage({ text: `Cloud Firestore successfully synced! (${res.count} documents published).`, type: 'success' });
      } else {
        setMessage({ text: res.error || 'Firestore sync encountered an error.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: 'Cloud sync error: ' + err.message, type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setMessage({ text: 'Cannot format: ' + err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <span>Database Manager & Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct database access: inspect records, live JSON editor, import/export backups, and sync with Firebase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={handleResetToSeed}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
            title="Populate complete official Vidisha directory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Seed DB</span>
          </button>

          <button
            onClick={handleSyncToFirestore}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            title="Sync all local data to Cloud Firestore"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>{syncing ? 'Syncing...' : 'Sync to Firestore'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Database Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveCollection('businesses')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeCollection === 'businesses'
              ? 'bg-blue-50/70 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Businesses</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.businesses}</p>
        </div>

        <div
          onClick={() => setActiveCollection('categories')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeCollection === 'categories'
              ? 'bg-blue-50/70 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Grid className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Categories</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.categories}</p>
        </div>

        <div
          onClick={() => setActiveCollection('offers')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeCollection === 'offers'
              ? 'bg-blue-50/70 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Tag className="w-4 h-4 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Offers</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.offers}</p>
        </div>

        <div
          onClick={() => setActiveCollection('applications')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeCollection === 'applications'
              ? 'bg-blue-50/70 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <FileCheck className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Applications</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.applications}</p>
        </div>

        <div
          onClick={() => setActiveCollection('payments')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeCollection === 'payments'
              ? 'bg-blue-50/70 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Payments</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.payments}</p>
        </div>
      </div>

      {/* Interactive JSON Database Editor */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Live JSON Editor: <span className="text-blue-700 capitalize">{activeCollection}</span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Edit the raw JSON data directly. Click "Save Database Changes" to apply instantly.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleFormatJson}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
            >
              Format JSON
            </button>

            <button
              onClick={handleSaveJsonEditor}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Database Changes</span>
            </button>
          </div>
        </div>

        {/* Collection Selector Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveCollection('businesses')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'businesses'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Businesses ({stats.businesses})
          </button>
          <button
            onClick={() => setActiveCollection('categories')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Categories ({stats.categories})
          </button>
          <button
            onClick={() => setActiveCollection('offers')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'offers'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Offers ({stats.offers})
          </button>
          <button
            onClick={() => setActiveCollection('applications')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'applications'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Applications ({stats.applications})
          </button>
          <button
            onClick={() => setActiveCollection('payments')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'payments'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Payments ({stats.payments})
          </button>
          <button
            onClick={() => setActiveCollection('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCollection === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Full Database (All Collections)
          </button>
        </div>

        {/* JSON Textarea */}
        <div className="relative">
          <textarea
            rows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full font-mono text-[11px] leading-relaxed p-4 rounded-2xl border border-slate-300 focus-ring bg-slate-900 text-slate-100 selection:bg-blue-600"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDatabasePage;
