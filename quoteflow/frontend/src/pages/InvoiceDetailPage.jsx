import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    api.get(`/invoices/${id}`).then(({ data }) => { setInvoice(data); setLoading(false); });
  }, [id]);

  const handleMarkPaid = async () => {
    setMarking(true);
    const { data } = await api.patch(`/invoices/${id}/status`, { paymentStatus: 'completed' });
    setInvoice(data);
    setMarking(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-gray-400">Loading...</p></div>;
  if (!invoice) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="p-8 text-red-400">Invoice not found.</p></div>;

  const quote = invoice.quoteId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Invoice</p>
              <h1 className="text-2xl font-bold text-primary font-mono">{invoice.invoiceNumber}</h1>
              <p className="text-sm text-gray-500 mt-1">Issued: {new Date(invoice.issuedAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              invoice.paymentStatus === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>{invoice.paymentStatus}</span>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">From</p>
              <p className="font-medium">{invoice.vendorId?.businessName || invoice.vendorId?.name}</p>
              <p className="text-gray-500">{invoice.vendorId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">To</p>
              <p className="font-medium">{invoice.clientId?.name}</p>
              <p className="text-gray-500">{invoice.clientId?.email}</p>
            </div>
          </div>

          {/* Items from quote */}
          {quote?.items && (
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
          )}

          <div className="text-right space-y-1 text-sm border-t pt-3">
            {quote && <>
              <p>Subtotal: <strong>₹{quote.subtotal?.toFixed(2)}</strong></p>
              <p>Tax ({quote.taxRate}%): <strong>₹{quote.taxAmount?.toFixed(2)}</strong></p>
            </>}
            <p className="text-lg font-bold text-primary">Total: ₹{invoice.totalAmount?.toFixed(2)}</p>
          </div>

          {user.role === 'vendor' && invoice.paymentStatus === 'pending' && (
            <div className="mt-6 border-t pt-4">
              <button onClick={handleMarkPaid} disabled={marking}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60">
                {marking ? 'Updating...' : '✓ Mark as Paid'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
