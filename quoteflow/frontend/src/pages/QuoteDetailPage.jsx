import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


export default function QuoteDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote]       = useState(null);
  const [note, setNote]         = useState('');
  const [loading, setLoading]   = useState(true);
  const [actionLoading, setAL]  = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    api.get(`/quotes/${id}`).then(({ data }) => { setQuote(data); setLoading(false); });
  }, [id]);

  const handleApprove = async () => {
    setAL(true);
    await api.patch(`/quotes/${id}/approve`);
    setQuote(q => ({ ...q, status: 'approved' }));
    setAL(false);
  };

  const handleRevise = async () => {
    if (!note.trim()) return setError('Please add a revision note');
    setAL(true);
    await api.patch(`/quotes/${id}/revise`, { note });
    setQuote(q => ({ ...q, status: 'revision', revisionNote: note }));
    setNote('');
    setAL(false);
  };

  const handleConvert = async () => {
    setAL(true);
    try {
      const { data } = await api.post(`/invoices/${id}`);
      navigate(`/invoices/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to convert');
      setAL(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>;
  if (!quote)  return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-red-400">Quote not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-primary">Quote Details</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {user.role === 'vendor'
                  ? `Client: ${quote.clientId?.name}`
                  : `From: ${quote.vendorId?.businessName || quote.vendorId?.name}`}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              quote.status === 'sent'     ? 'bg-orange-100 text-orange-700' :
              quote.status === 'approved' ? 'bg-green-100 text-green-700' :
              quote.status === 'revision' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>{quote.status}</span>
          </div>

          {quote.revisionNote && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
              <strong>Revision requested:</strong> {quote.revisionNote}
            </div>
          )}

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

          {/* Line items */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Item</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Unit Price</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">₹{item.unitPrice?.toFixed(2)}</td>
                  <td className="py-2 text-right">₹{item.total?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-1 text-sm border-t pt-3">
            <p>Subtotal: <strong>₹{quote.subtotal?.toFixed(2)}</strong></p>
            <p>Tax ({quote.taxRate}%): <strong>₹{quote.taxAmount?.toFixed(2)}</strong></p>
            <p className="text-lg font-bold text-primary">Total: ₹{quote.totalAmount?.toFixed(2)}</p>
          </div>

          {/* Client actions */}
          {user.role === 'client' && quote.status === 'sent' && (
            <div className="mt-6 space-y-3 border-t pt-4">
              <button onClick={handleApprove} disabled={actionLoading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60">
                ✓ Approve Quote
              </button>
              <div className="flex gap-2">
                <input type="text" placeholder="Revision note..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={note} onChange={e => setNote(e.target.value)}
                />
                <button onClick={handleRevise} disabled={actionLoading}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition disabled:opacity-60">
                  Request Revision
                </button>
              </div>
            </div>
          )}

          {/* Vendor action */}
          {user.role === 'vendor' && quote.status === 'approved' && (
            <div className="mt-6 border-t pt-4">
              <button onClick={handleConvert} disabled={actionLoading}
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-60">
                Convert to Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
