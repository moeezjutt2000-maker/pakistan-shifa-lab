// app/page.js
'use client';
import { useState, useEffect } from 'react';

export default function ShifaAllInOnePortal() {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    testName: '',
    testValue: '',
    testUnit: 'mg/dL',
    referenceRange: '',
    comments: ''
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [databaseRecords, setDatabaseRecords] = useState([]);

  // Built-in Database: Automatically loads records from browser storage on startup
  useEffect(() => {
    const savedData = localStorage.getItem('shifa_db');
    if (savedData) {
      setDatabaseRecords(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile({
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Processing diagnostic metrics...' });

    // Simulate short server process delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const newRecord = {
        id: 'SHIFA-' + Math.floor(100000 + Math.random() * 900000),
        ...formData,
        attachedFile: file ? { name: file.name, size: file.size } : null,
        dateLogged: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
      };

      // Appends new record directly to storage engine
      const updatedDb = [newRecord, ...databaseRecords];
      setDatabaseRecords(updatedDb);
      localStorage.setItem('shifa_db', JSON.stringify(updatedDb));

      setStatus({ type: 'success', message: '✅ Entry successfully saved to Shifa Records!' });
      setFormData({ patientId: '', patientName: '', testName: '', testValue: '', testUnit: 'mg/dL', referenceRange: '', comments: '' });
      setFile(null);
      e.target.reset();
    } catch (err) {
      setStatus({ type: 'error', message: '❌ Error executing secure storage transaction.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans grid grid-cols-1 lg:grid-cols-3 p-4 md:p-8 gap-8">
      
      {/* LEFT COLUMN: THE INPUT PORTAL FORM */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-emerald-800">Shifa Diagnostics</h1>
          <p className="text-slate-500 text-xs mt-1">Unified Digital Health Upload & Entry System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patient Name</label>
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="e.g., Muhammad Ali" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patient CNIC / ID</label>
            <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="e.g., 35202-XXXXXXX-X" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lab Test Name</label>
            <input type="text" name="testName" value={formData.testName} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="e.g., HbA1c, Fasting Glucose" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Observed Value</label>
              <input type="text" name="testValue" value={formData.testValue} onChange={handleChange} required className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="e.g., 5.7 or 125" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Measurement Unit</label>
              <select name="testUnit" value={formData.testUnit} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none">
                <option value="mg/dL">mg/dL</option>
                <option value="g/dL">g/dL</option>
                <option value="%">% Percentage</option>
                <option value="mmol/L">mmol/L</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reference Range Normal Guidelines</label>
            <input type="text" name="referenceRange" value={formData.referenceRange} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="e.g., Less than 5.7%" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attach Signed Lab Report (PDF/Image)</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Remarks / Notes</label>
            <textarea name="comments" value={formData.comments} onChange={handleChange} rows="2" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Patient history or pathology details..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium p-3 rounded-lg text-sm transition-all duration-150 shadow-sm disabled:bg-slate-300 cursor-pointer">
            {loading ? 'Committing Data...' : 'Save Result Entry'}
          </button>
        </form>

        {status.message && (
          <div className={`mt-4 p-3 rounded-lg text-xs text-center font-semibold ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            {status.message}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: BUILT-IN REAL-TIME DATABASE VIEW */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
        <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Stored Diagnostic Logs</h2>
            <p className="text-slate-500 text-xs">Live dashboard pulling from your active system data engine</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {databaseRecords.length} Total Records
          </span>
        </div>

        {databaseRecords.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-400 font-medium text-sm">No lab entries found in the system memory.</p>
            <p className="text-slate-400 text-xs mt-1">Fill out the left-hand form parameters to populate this live database view.</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[650px] pr-2">
            {databaseRecords.map((record) => (
              <div key={record.id} className="p-4 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {record.id}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">{record.patientName}</h3>
                    <span className="text-[11px] text-slate-400">({record.patientId})</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
                    <p className="text-slate-600"><strong className="text-slate-500">Test:</strong> {record.testName}</p>
                    <p className="text-slate-600"><strong className="text-slate-500">Normal Range:</strong> {record.referenceRange}</p>
                    {record.attachedFile && (
                      <p className="text-emerald-700 col-span-2 font-medium mt-1">📎 Attached: {record.attachedFile.name}</p>
                    )}
                    {record.comments && (
                      <p className="text-slate-500 italic col-span-2 mt-1 bg-white p-2 rounded border border-slate-100">“{record.comments}”</p>
                    )}
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <div className="text-xl font-black text-emerald-700">
                    {record.testValue} <span className="text-xs font-normal text-slate-500">{record.testUnit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{record.dateLogged}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
