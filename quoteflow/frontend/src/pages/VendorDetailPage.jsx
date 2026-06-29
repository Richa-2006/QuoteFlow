import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';

const emptyItem = { name: '', quantity: 1, unit: 'pcs' };

export default function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor]   = useState(null);
  const [items, setItems]     = useState([{ ...emptyItem }]);
  const [description, setDesc] = useState('');
  const [budget, setBudget]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/vendors/${id}`).then(({ data }) => setVendor(data));
  }, [id]);

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/requests', { vendorId: id, items, description, budget: Number(budget) });
      setSuccess(true);
      setTimeout(() => navigate('/client/requests'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!vendor) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h1 className="text-xl font-bold text-primary">{vendor.businessName || vendor.name}</h1>
          {vendor.category && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">{vendor.category}</span>}
          {vendor.description && <p className="text-gray-500 text-sm mt-3">{vendor.description}</p>}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Submit Quote Request</h2>

          {success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">Request submitted! Redirecting...</div>}
          {error   && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Items</label>
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Item name" required
                    className="flex-1 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                  />
                  <input type="number" min={1} placeholder="Qty" required
                    className="w-16 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)}
                  />
                  <input type="text" placeholder="Unit"
                    className="w-20 border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)}
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setItems([...items, { ...emptyItem }])}
                className="text-primary text-sm hover:underline mt-1">+ Add item</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description / Notes</label>
              <textarea rows={3} placeholder="Describe what you need..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={description} onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget (₹) <span className="text-gray-400 font-normal">optional</span></label>
              <input type="number" min={0} placeholder="e.g. 5000"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={budget} onChange={e => setBudget(e.target.value)}
              />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
