import React from 'react';
import { Upload, FileSpreadsheet, FileText, Loader2, CheckCircle, AlertCircle, Gem } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'sonner';

/*const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;*/
// Provide a hardcoded fallback to your FastAPI port (8000)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
// Ensure this only has ONE /api prefix
const API = `${BACKEND_URL}/api`;

const isDev = process.env.NODE_ENV === 'development';

// ───────────────────── Sub-components ─────────────────────

const Header = () => (
  <header className="border-b border-slate-200 bg-white" data-testid="header">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center">
          <Gem className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900" data-testid="app-title">
            Gem Certificate Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">SCS Sustainability Certification System</p>
        </div>
      </div>
    </div>
  </header>
);

const InfoBanner = () => (
  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4" data-testid="info-banner">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-blue-900 mb-1">Important: Valid Stone IDs Required</p>
        <p className="text-xs text-blue-700">
          Please enter valid stone IDs from your SCS account. Test IDs will return "not found" errors if they don't exist in the SCS database.
        </p>
      </div>
    </div>
  </div>
);

const ManualInput = ({ value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
      Enter Stone IDs (one per line)
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-64 p-3 border border-slate-300 rounded-sm text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      placeholder={"ST001\nST002\nST003"}
      data-testid="manual-input-textarea"
    />
  </div>
);

const FileFormatGuide = () => (
  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-sm" data-testid="file-format-guide">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Expected File Format</p>
    <div className="bg-white border border-slate-200 rounded p-2 font-mono text-xs text-slate-700">
      <table className="w-full">
        <thead>
          <tr><th className="text-left pb-1 border-b border-slate-100 text-slate-500">inventory_id</th></tr>
        </thead>
        <tbody>
          <tr><td className="pt-1">LZ1809693</td></tr>
          <tr><td>LZ2107107</td></tr>
          <tr><td>LZ2140682</td></tr>
        </tbody>
      </table>
    </div>
    <p className="text-xs text-slate-400 mt-2">First column should contain stone IDs. Header row with "inventory_id" or "stone" is auto-detected.</p>
  </div>
);

const UploadedStonesPreview = ({ stones }) => {
  if (stones.length === 0) return null;
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-sm" data-testid="uploaded-stones-preview">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
        Extracted {stones.length} Stone IDs
      </p>
      <div className="max-h-32 overflow-y-auto">
        {stones.slice(0, 10).map((id) => (
          <span key={id} className="inline-block bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono mr-2 mb-2">
            {id}
          </span>
        ))}
        {stones.length > 10 && (
          <span className="text-xs text-slate-500">+{stones.length - 10} more</span>
        )}
      </div>
    </div>
  );
};

const FileUploadSection = ({ onDrop, uploadedStones }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-slate-900 bg-slate-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        data-testid="file-upload-zone"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" strokeWidth={1.5} />
        <p className="text-sm font-medium text-slate-700 mb-1">
          {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
        </p>
        <p className="text-xs text-slate-500">or click to browse</p>
        <p className="text-xs text-slate-400 mt-2">Supports CSV, XLS, XLSX</p>
      </div>
      <FileFormatGuide />
      <UploadedStonesPreview stones={uploadedStones} />
    </div>
  );
};

const ExportControls = ({ hasResults, onExport }) => (
  <div className="bg-white border border-slate-200 rounded-md p-6" data-testid="export-section">
    <h2 className="text-xl font-semibold mb-4 text-slate-900">Export Results</h2>
    <p className="text-sm text-slate-500 mb-6">
      Download verification results in your preferred format
    </p>
    <div className="space-y-3">
      <button
        onClick={() => onExport('excel')}
        disabled={!hasResults}
        className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-sm font-medium tracking-wide hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        data-testid="export-excel-button"
      >
        <FileSpreadsheet className="w-5 h-5" />
        Export to Excel
      </button>
      <button
        onClick={() => onExport('pdf')}
        disabled={!hasResults}
        className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-sm font-medium tracking-wide hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        data-testid="export-pdf-button"
      >
        <FileText className="w-5 h-5" />
        Export to PDF
      </button>
    </div>
    {hasResults && (
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-sm" data-testid="results-summary">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Stones Verified</p>
            <p className="text-xs text-emerald-700 mt-1">Ready for export</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const ResultRow = ({ gem }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors" data-testid={`result-row-${gem.inventory_id}`}>
    <td className="py-3 px-2 text-sm font-mono font-medium text-slate-900">{gem.inventory_id}</td>
    <td className="py-3 px-2 text-sm text-right font-mono text-slate-700">{gem.carat_wt || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.color_code || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.clarity_code || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.shape_code || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.cut_value || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.polish_value || '-'}</td>
    <td className="py-3 px-2 text-sm text-slate-700">{gem.symmetry_value || '-'}</td>
    <td className="py-3 px-2 text-sm">
      {gem.certified_sustainable === true || gem.certified_sustainable === 'true' ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded" data-testid={`sustainable-badge-${gem.inventory_id}`}>
          <CheckCircle className="w-3 h-3" /> Yes
        </span>
      ) : gem.certified_sustainable === false || gem.certified_sustainable === 'false' ? (
        <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded">No</span>
      ) : (
        <span className="text-slate-400">-</span>
      )}
    </td>
    <td className="py-3 px-2 text-sm">
      {gem.scs_gem_certificate_url ? (
        <a
          href={gem.scs_gem_certificate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
          data-testid={`certificate-link-${gem.inventory_id}`}
        >
          View
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      )}
    </td>
  </tr>
);

const ResultsTable = ({ results }) => {
  if (results.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 fade-in" data-testid="results-table-container">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Verification Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full gem-table" data-testid="results-table">
          <thead>
            <tr className="border-b-2 border-slate-900">
              {['Inventory ID', 'Carat', 'Color', 'Clarity', 'Shape', 'Cut', 'Polish', 'Symmetry', 'Sustainable', 'Certificate'].map((h) => (
                <th key={h} className={`${h === 'Carat' ? 'text-right' : 'text-left'} py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-widest`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((gem) => (
              <ResultRow key={gem.inventory_id} gem={gem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptyState = ({ loading }) => {
  if (loading) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-md p-12 text-center" data-testid="empty-state">
      <Gem className="w-16 h-16 mx-auto mb-4 text-slate-300" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Yet</h3>
      <p className="text-sm text-slate-500">
        Enter stone IDs or upload a file to get started
      </p>
    </div>
  );
};

// ───────────────────── Main Dashboard ─────────────────────

const Dashboard = () => {
  const [manualInput, setManualInput] = React.useState('');
  const [uploadedStones, setUploadedStones] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('manual');

  const onDrop = React.useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API}/upload-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedStones(response.data);
      setActiveTab('upload');
      toast.success(`Extracted ${response.data.length} stone IDs from file`);
    } catch (error) {
      if (isDev) console.error('File upload error:', error);
      toast.error('Failed to process file');
    }
  }, []);

  const handleVerify = React.useCallback(async () => {
    const stoneIds = activeTab === 'manual'
      ? manualInput.split('\n').map(id => id.trim()).filter(id => id.length > 0)
      : uploadedStones;

    if (stoneIds.length === 0) {
      toast.error('Please enter at least one stone ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/verify-stones`, { stone_ids: stoneIds });
      setResults(response.data);
      toast.success(`Verified ${response.data.length} stones`);
    } catch (error) {
      if (isDev) console.error('Verification error:', error);
      if (error.response?.status === 500 && error.response?.data?.detail?.includes('404')) {
        toast.error('Stone IDs not found in SCS database. Please verify your IDs.');
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to verify stones. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, manualInput, uploadedStones]);

  const handleExport = React.useCallback(async (format) => {
    if (results.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      const response = await axios.post(`${API}/prepare-export`, { format, gems: results });
      // In handleExport function
      const downloadUrl = `${BACKEND_URL}/api/download/${response.data.token}`;
      /*const downloadUrl = `${API}/download/${response.data.token}`;*/
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_self';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Exported to ${format.toUpperCase()}`);
    } catch (error) {
      if (isDev) console.error('Export error:', error);
      toast.error('Failed to export');
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InfoBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div className="bg-white border border-slate-200 rounded-md p-6" data-testid="input-section">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">Input Stone IDs</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  activeTab === 'manual'
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                data-testid="manual-tab"
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                data-testid="upload-tab"
              >
                File Upload
              </button>
            </div>

            {activeTab === 'manual'
              ? <ManualInput value={manualInput} onChange={setManualInput} />
              : <FileUploadSection onDrop={onDrop} uploadedStones={uploadedStones} />
            }

            <button
              onClick={handleVerify}
              disabled={loading}
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-sm font-medium tracking-wide hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              data-testid="verify-button"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                : <><CheckCircle className="w-5 h-5" /> Verify Stones</>
              }
            </button>
          </div>

          <ExportControls hasResults={results.length > 0} onExport={handleExport} />
        </div>

        {results.length > 0
          ? <ResultsTable results={results} />
          : <EmptyState loading={loading} />
        }
      </main>
    </div>
  );
};

export default Dashboard;
