import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyItem = { name: '', quantity: 1, unitPrice: 0 };

export default function QuotesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const reqId = searchParams.get('reqId');

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!reqId);
  const [items, setItems]     = useState([{ ...emptyItem }]);
  const [taxRate, setTaxRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState('');

  const fetchQuotes = async () => {
    const { data } = await api.get('/quotes');
    setQuotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) * Number(it.unitPrice)), 0);
  const tax      = (subtotal * taxRate) / 100;
  const total    = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/quotes/from-request/${reqId}`, { items, taxRate: Number(taxRate) });
      setShowForm(false);
      fetchQuotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">
            {user.role === 'vendor' ? 'My Quotes' : 'Quotes Received'}
          </h1>
        </div>

        {/* Create Quote Form (vendor only) */}
        {user.role === 'vendor' && showForm && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Create Quote</h2>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Line Items</label>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Item name" required
                      className="flex-1 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                    />
                    <input type="number" min={1} placeholder="Qty" required
                      className="w-16 border rounded px-2 py-1.5 text-sm"
                      value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)}
                    />
                    <input type="number" min={0} step="0.01" placeholder="Unit price" required
                      className="w-28 border rounded px-2 py-1.5 text-sm"
                      value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value)}
                    />
                    <span className="text-sm text-gray-500 flex items-center w-24">
                      = ₹{(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setItems([...items, { ...emptyItem }])}
                  className="text-primary text-sm hover:underline">+ Add item</button>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                  <input type="number" min={0} max={100} step="0.1"
                    className="w-24 border rounded px-2 py-1.5 text-sm"
                    value={taxRate} onChange={e => setTaxRate(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-700 mt-4 space-y-0.5">
                  <p>Subtotal: <strong>₹{subtotal.toFixed(2)}</strong></p>
                  <p>Tax ({taxRate}%): <strong>₹{tax.toFixed(2)}</strong></p>
                  <p className="text-base font-bold text-primary">Total: ₹{total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-900 transition disabled:opacity-60">
                  {submitting ? 'Saving...' : 'Save Quote'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quotes list */}
        {loading ? <p className="text-gray-400">Loading...</p> :
         quotes.length === 0 ? <p className="text-gray-400">No quotes yet.</p> : (
          <div className="space-y-3">
            {quotes.map(q => (
              <div key={q._id} className="bg-white rounded-xl border shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {user.role === 'vendor'
                      ? `Client: ${q.clientId?.name}`
                      : `Vendor: ${q.vendorId?.businessName || q.vendorId?.name}`}
                  </p>
                  <p className="text-sm text-gray-500">{q.items?.length} item(s) · ₹{q.totalAmount?.toFixed(2)}</p>
                  {q.revisionNote && <p className="text-xs text-red-500 mt-1">Revision: {q.revisionNote}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    q.status === 'sent'     ? 'bg-orange-100 text-orange-700' :
                    q.status === 'approved' ? 'bg-green-100 text-green-700' :
                    q.status === 'revision' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{q.status}</span>
                  <Link to={`/quotes/${q._id}`} className="text-primary text-sm hover:underline">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
